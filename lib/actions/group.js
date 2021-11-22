/*client.on("group-participants-update", async (_events) => {
  let userId = _events.participants;
  let groupId = _events.jid;
  let groupM = await client.groupMetadata(groupId);
  switch (_events.action) {
    case "remove": {
      for (let id of userId) {
        let txt = `@${id.split("@")[0]} Left the chat in Group ${groupM.subject}`;
        client.sendMessage(groupId, txt, "conversation", { 
          contextInfo: { 
            mentionedJid: userId 
          }
        });
      }
      break;
    }
    case "add": {
      for (let id of userId) {
        let txt = `@${id.split("@")[0]} Joined the chat in Group ${groupM.subject}`;
        client.sendMessage(groupId, txt, "conversation", { 
          contextInfo: {
            mentionedJid: userId
          }
        });
      }
      break;
    }
    case "promote": {
      for (let id of userId) {
        let txt = `@${id.split("@")[0]} was Promoted in Group ${groupM.subject}`;
        client.sendMessage(groupId, txt, "conversation", { 
          contextInfo: {
            mentionedJid: userId
          }
        });
      }
      break;
    }
    case "demote": {
      for (let id of userId) {
        let txt = `@${id.split("@")[0]} was Demoted in Group ${groupM.subject}`;
        client.sendMessage(groupId, txt, "conversation", { 
          contextInfo: {
            mentionedJid: userId
          }
        });
      }
      break;
    }
  }
});

client.on("group-update", async (_events) => {
  let groupId = _events.jid;
  let groupM = await client.groupMetadata(groupId);
  // Group Info Setting
  switch (_events["restrict"]) {
    case "true": {
      let txt = `Group Info settings on "Only Admin Mode" in Group ${groupM.subject}`;
      client.sendMessage(groupId, txt, "conversation");
      break;
    }
    case "false": {
      let txt = `Group Info settings on "Public Mode" in Group ${groupM.subject}`;
      client.sendMessage(groupId, txt, "conversation");
      break;
    }
  }
  // Group Message Setting
  switch (_events["announce"]) {
    case "true": {
      let txt = `Group Message settings on "Only Admin Mode" in Group ${groupM.subject}`;
      client.sendMessage(groupId, txt, "conversation");
      break;
    }
    case "false": {
      let txt = `Group Message settings on "Public Mode" in Group ${groupM.subject}`;
      client.sendMessage(groupId, txt, "conversation");
      break;
    }
  }
  console.log(JSON.stringify(_events, null, 2));
});
*/