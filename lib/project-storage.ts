import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Directory, Paths } from "expo-file-system";
import type { Project, RedesignEntry } from "@/types/project";
import type { RoomAnalysis } from "@/types/room-analysis";

const INDEX_KEY = "projects_index";
const PROJECT_PREFIX = "project:";

function projectKey(id: string) {
  return `${PROJECT_PREFIX}${id}`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getProjectDir(projectId: string): Directory {
  return new Directory(Paths.document, `projects/${projectId}`);
}

function ensureDir(dir: Directory) {
  if (!dir.exists) {
    dir.create();
  }
}

// ============================================================================
// Index operations
// ============================================================================

async function getIndex(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setIndex(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

// ============================================================================
// Public API
// ============================================================================

export async function getAllProjects(): Promise<Project[]> {
  const ids = await getIndex();
  const keys = ids.map(projectKey);
  if (keys.length === 0) return [];

  const pairs = await AsyncStorage.multiGet(keys);
  const projects: Project[] = [];
  for (const [, value] of pairs) {
    if (value) {
      try {
        projects.push(JSON.parse(value));
      } catch {
        // skip corrupt entries
      }
    }
  }
  // Sort by updatedAt descending
  projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return projects;
}

export async function getProject(id: string): Promise<Project | null> {
  const raw = await AsyncStorage.getItem(projectKey(id));
  return raw ? JSON.parse(raw) : null;
}

export async function createProject(
  name: string,
  meta?: { region?: Project["region"]; hemisphere?: Project["hemisphere"] }
): Promise<Project> {
  const id = generateId();
  const now = new Date().toISOString();
  const project: Project = {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    redesigns: [],
    region: meta?.region,
    hemisphere: meta?.hemisphere,
  };

  const index = await getIndex();
  index.unshift(id);
  await AsyncStorage.setItem(projectKey(id), JSON.stringify(project));
  await setIndex(index);
  return project;
}

export async function updateProjectMeta(
  projectId: string,
  meta: { region?: Project["region"]; hemisphere?: Project["hemisphere"] }
): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found");

  if (meta.region !== undefined) project.region = meta.region;
  if (meta.hemisphere !== undefined) project.hemisphere = meta.hemisphere;
  project.updatedAt = new Date().toISOString();
  await saveProject(project);
}

export async function saveProject(project: Project): Promise<void> {
  await AsyncStorage.setItem(projectKey(project.id), JSON.stringify(project));
}

export async function deleteProject(id: string): Promise<void> {
  const index = await getIndex();
  await setIndex(index.filter((i) => i !== id));
  await AsyncStorage.removeItem(projectKey(id));

  // Clean up files
  const dir = getProjectDir(id);
  if (dir.exists) {
    dir.delete();
  }
}

export async function saveImageToProject(
  projectId: string,
  redesignId: string,
  type: "before" | "after",
  base64: string
): Promise<string> {
  const projectDir = getProjectDir(projectId);
  ensureDir(new Directory(Paths.document, "projects"));
  ensureDir(projectDir);

  const ext = type === "before" ? "jpg" : "png";
  const fileName = `${redesignId}_${type}.${ext}`;
  const file = new File(projectDir, fileName);
  file.create();
  file.write(base64, { encoding: "base64" });
  return file.uri;
}

export async function addRedesignToProject(
  projectId: string,
  data: {
    roomType: string;
    style: string;
    guestType?: string;
    customInstructions?: string;
    beforeBase64: string;
    afterBase64: string;
    listingText?: string;
    roomAnalysis?: RoomAnalysis;
  }
): Promise<RedesignEntry> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found");

  const redesignId = generateId();

  const beforePath = await saveImageToProject(
    projectId,
    redesignId,
    "before",
    data.beforeBase64
  );
  const afterPath = await saveImageToProject(
    projectId,
    redesignId,
    "after",
    data.afterBase64
  );

  const entry: RedesignEntry = {
    id: redesignId,
    createdAt: new Date().toISOString(),
    roomType: data.roomType,
    style: data.style,
    guestType: data.guestType,
    customInstructions: data.customInstructions,
    beforeImagePath: beforePath,
    afterImagePath: afterPath,
    listingText: data.listingText,
    roomAnalysis: data.roomAnalysis,
  };

  project.redesigns.unshift(entry);
  project.coverImagePath = afterPath;
  project.updatedAt = new Date().toISOString();
  await saveProject(project);

  return entry;
}

export async function updateRedesignListingText(
  projectId: string,
  redesignId: string,
  text: string
): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found");

  const entry = project.redesigns.find((r) => r.id === redesignId);
  if (!entry) throw new Error("Redesign not found");

  entry.listingText = text;
  project.updatedAt = new Date().toISOString();
  await saveProject(project);
}

export async function deleteRedesign(
  projectId: string,
  redesignId: string
): Promise<void> {
  const project = await getProject(projectId);
  if (!project) throw new Error("Project not found");

  project.redesigns = project.redesigns.filter((r) => r.id !== redesignId);
  if (project.redesigns.length > 0) {
    project.coverImagePath = project.redesigns[0].afterImagePath;
  } else {
    project.coverImagePath = undefined;
  }
  project.updatedAt = new Date().toISOString();
  await saveProject(project);

  // Clean up files
  const dir = getProjectDir(projectId);
  const beforeFile = new File(dir, `${redesignId}_before.jpg`);
  const afterFile = new File(dir, `${redesignId}_after.png`);
  if (beforeFile.exists) beforeFile.delete();
  if (afterFile.exists) afterFile.delete();
}
