import { SQLiteDatabase } from "expo-sqlite";
import { Model } from "./db.types";

export const AddModel = async ({
  db,
  model,
}: {
  db: SQLiteDatabase;
  model: Model;
}) => {
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO Models (id, type, features, info) VALUES (?, ?, ?, ?)`,
      [
        model.id,
        model.type,
        JSON.stringify(model.features),
        JSON.stringify(model.info),
      ]
    );
  } catch (error) {
    console.error("Failed to insert model:", error);
  }
};

export const BatchAddModels = async ({
  db,
  models,
}: {
  db: SQLiteDatabase;
  models: Model[];
}) => {
  try {
    const insertQuery = `INSERT OR IGNORE INTO Models (id, type, features, info) VALUES (?, ?, ?, ?)`;

    for (const model of models) {
      await db.runAsync(insertQuery, [
        model.id,
        model.type,
        JSON.stringify(model.features),
        JSON.stringify(model.info),
      ]);
    }
  } catch (error) {
    console.error("Failed to batch insert models:", error);
  }
};

export const BatchSuperAddModels = async ({
  db,
  models,
}: {
  db: SQLiteDatabase;
  models: any[] | Model[];
}) => {
  try {
    await db.execAsync("BEGIN TRANSACTION");
    const insertQuery = `INSERT OR IGNORE INTO Models (id, type, features, info) VALUES (?, ?, ?, ?)`;
    for (const model of models) {
      await db.runAsync(insertQuery, [
        model.id,
        model.type,
        JSON.stringify(model.features),
        JSON.stringify(model.info),
      ]);
    }
    await db.execAsync("COMMIT");
  } catch (error) {
    console.error("Failed to batch insert models:", error);
    await db.execAsync("ROLLBACK");
  }
};

export const GetAllModels = async (db: SQLiteDatabase): Promise<Model[]> => {
  try {
    const results = await db.getAllAsync(`SELECT * FROM Models`);
    return results.map((row: any) => ({
      id: row.id,
      type: row.type,
      features: JSON.parse(row.features),
      info: JSON.parse(row.info),
    }));
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return [];
  }
};

export const GetModelByID = async (
  db: SQLiteDatabase,
  id: string
): Promise<Model | null> => {
  try {
    const results: any = await db.getFirstAsync<Model>(
      `SELECT * FROM Models WHERE id = ?`,
      [id]
    );

    if (!results) return null;

    return {
      id: results.id,
      type: results.type,
      features: JSON.parse(results.features),
      info: JSON.parse(results.info),
    };
  } catch (error) {
    console.error("Failed to fetch model by ID:", error);
    return null;
  }
};

export const SearchModels = async (
  db: SQLiteDatabase,
  keyword: string
): Promise<Model[]> => {
  try {
    const results = await db.getAllAsync(
      `SELECT * FROM Models WHERE id LIKE ? OR info LIKE ?`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    return results.map((row: any) => ({
      id: row.id,
      type: row.type,
      features: JSON.parse(row.features),
      info: JSON.parse(row.info),
    }));
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const FilterModelsByType = async (
  db: SQLiteDatabase,
  type: string
): Promise<Model[]> => {
  try {
    const results = await db.getAllAsync(
      `SELECT * FROM Models WHERE type = ?`,
      [type]
    );

    return results.map((row: any) => ({
      id: row.id,
      type: row.type,
      features: JSON.parse(row.features),
      info: JSON.parse(row.info),
    }));
  } catch (error) {
    console.error("Filter failed:", error);
    return [];
  }
};

export const MarkModelAsUsed = async (db: SQLiteDatabase, modelId: string) => {
  await db.runAsync(
    `UPDATE Models SET last_used = datetime('now') WHERE id = ?`,
    [modelId]
  );
};

export const GetRecentlyUsedModels = async (
  db: SQLiteDatabase,
  limit = 5
): Promise<Model[]> => {
  const rows = await db.getAllAsync(
    `SELECT * FROM Models WHERE last_used IS NOT NULL ORDER BY last_used DESC LIMIT ?`,
    [limit]
  );

  return rows.map((row: any) => ({
    id: row.id,
    type: row.type,
    features: JSON.parse(row.features),
    info: JSON.parse(row.info),
  }));
};

export const GetSuggestedModels = async (
  db: SQLiteDatabase,
  type = "chat-completion",
  excludeIds: string[] = [],
  limit = 3
): Promise<Model[]> => {
  const placeholders = excludeIds.map(() => "?").join(", ") || "''";
  const rows = await db.getAllAsync(
    `SELECT * FROM Models 
       WHERE type = ? 
       AND id NOT IN (${placeholders}) 
       ORDER BY RANDOM() 
       LIMIT ?`,
    [type, ...excludeIds, limit]
  );

  return rows.map((row: any) => ({
    id: row.id,
    type: row.type,
    features: JSON.parse(row.features),
    info: JSON.parse(row.info),
  }));
};

export const GetModelTypes = async (db: SQLiteDatabase): Promise<string[]> => {
  try {
    const res = await db.getAllAsync("SELECT DISTINCT type FROM Models;");
    return res.map(
      (row: any) => row.type.charAt(0).toUpperCase() + row.type.slice(1)
    );
  } catch (error) {
    console.error("Failed to get model types:", error);
    return [];
  }
};
