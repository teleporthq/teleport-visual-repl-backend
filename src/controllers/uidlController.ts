import { uidlRepository } from "../repositories/uidlRepository";
import { Request, Response } from "express";
import { UIDLComponentName } from "../interfaces/uidl";

class uidlController {
  static async saveUidl(req: Request, res: Response): Promise<Response> {
    try {
      const { uidlEntry, entryName, user } = req.body;

      if (!entryName) {
        return res.status(400).send({
          error: "Component must be named!"
        });
      }

      const userId = user.userId;

      const dbUidlEntry = await uidlRepository.findEntry(entryName, userId);

      if (dbUidlEntry) {
        uidlRepository.saveEntryChanges(dbUidlEntry, uidlEntry);
        return res.status(200).send({
          success: `Success, uidl changed`
        });
      }

      await uidlRepository.addNewEntry({
        userId,
        uidlEntryString: uidlEntry,
        entryName
      });

      return res.status(201).send({
        success: `Success, uidl added`
      });
    } catch (err) {
      res.status(400).send({
        error: `Something went terribly wrong: ` + err
      });
    }
  }

  static async deleteUidl(req: Request, res: Response): Promise<Response> {
    try {
      const { entryName, user } = req.body;
      const userId = user.userId;

      const uidlEntry = await uidlRepository.findEntry(entryName, userId);

      uidlRepository.deleteEntry(uidlEntry);

      return res.status(200).send({
        success: `Success, entry deleted`
      });
    } catch {
      res.status(403).send({
        error: `Could not delete entry`
      });
    }
  }

  static async getUIDLByNameAndUser(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { entryName } = req.params;
    const userId = req.body.user.userId;

    const uidlEntry = await uidlRepository.findEntry(entryName, userId);
    if (uidlEntry) {
      return res.status(200).send({
        success: uidlEntry
      });
    }
    return res.status(400).send({
      error: "Is not found"
    });
  }

  static async getAllUIDLNames(req: Request, res: Response): Promise<Response> {
    const userId = req.body.user.userId;

    const entryNames: UIDLComponentName[] = await uidlRepository.findAllEntryNamesByUser(
      userId
    );

    if (entryNames.length) {
      return res.status(200).send({
        success: entryNames.map(entry => entry.EntryName)
      });
    }
    return res.status(400).send({
      error: "Did not find any entries"
    });
  }
}

export { uidlController };
