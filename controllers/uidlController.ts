import { UIDLEntry } from "../repositories/sequelize";

exports.save = async (req, res) => {
  try {
    const { userId, uidlEntry, entryName } = req.body;

    const isFound = await UIDLEntry.findOne({
      where: {
        UserUserId: userId,
        EntryName: entryName
      }
    });

    if (isFound) {
      isFound.UIDLEntry = uidlEntry;
      await isFound.save({ fields: ["UIDLEntry"] });
      return res.status(200).send({
        success: `Success, uidl changed`
      });
    }

    await UIDLEntry.create({
      UserUserId: userId,
      UIDLEntry: uidlEntry,
      EntryName: entryName
    });
    return res.status(200).send({
      success: `Success, uidl added`
    });
  } catch (err) {
    res.status(400).send({
      error: `Something went terribly wrong: ` + err
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { userId, entryName } = req.body;
    const isFound = await UIDLEntry.findOne({
      where: {
        UserUserId: userId,
        EntryName: entryName
      }
    });
    if (isFound) {
      await isFound.destroy();
      return res.status(200).send({
        error: `Success, entry deleted`
      });
    }

    throw new Error("Did not find what to delete");
  } catch {
    res.status(403).send({
      error: `Could not delete entry`
    });
  }
};

exports.getUIDLByNameAndUser = async (req, res) => {
  const { userId, entryName } = req.params;

  const isFound = await UIDLEntry.findOne({
    where: {
      UserUserId: userId,
      EntryName: entryName
    }
  });
  if (isFound) {
    return res.status(200).send({
      success: isFound
    });
  }
  return res.status(400).send({
    error: "Is not found"
  });
};

exports.getAllUIDLNames = async (req, res) => {
  const entryNames = await UIDLEntry.findAll({
    attributes: ["EntryName"],
    where: {
      UserUserId: req.params.userId
    }
  });

  if (entryNames.length) {
    return res.status(200).send({
      success: entryNames.map(entry => entry.EntryName)
    });
  }
  return res.status(400).send({
    error: "Did not find any entries"
  });
};
