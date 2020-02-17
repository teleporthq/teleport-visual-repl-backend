const uidlRepository = require("../repositories/uidlRepository");

exports.save = async (req, res) => {
  try {
    const { uidlEntry, entryName } = req.body;

    const userId = req.user.userId;

    const dbUidlEntry = await uidlRepository.findEntry(entryName, userId);

    if (dbUidlEntry) {
      uidlRepository.saveEntryChanges(dbUidlEntry, uidlEntry);
      return res.status(200).send({
        success: `Success, uidl changed`
      });
    }

    await uidlRepository.addNewEntry(userId, uidlEntry, entryName);

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
    const { entryName } = req.body;
    const userId = req.user.userId;

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
};

exports.getUIDLByNameAndUser = async (req, res) => {
  const { entryName } = req.params;
  const userId = req.user.userId;

  const uidlEntry = await uidlRepository.findEntry(entryName, userId);
  if (uidlEntry) {
    return res.status(200).send({
      success: uidlEntry
    });
  }
  return res.status(400).send({
    error: "Is not found"
  });
};

exports.getAllUIDLNames = async (req, res) => {
  const userId = req.user.userId;

  const entryNames = await uidlRepository.findAllEntryNamesByUser(userId);

  if (entryNames.length) {
    return res.status(200).send({
      success: entryNames.map(entry => entry.EntryName)
    });
  }
  return res.status(400).send({
    error: "Did not find any entries"
  });
};
