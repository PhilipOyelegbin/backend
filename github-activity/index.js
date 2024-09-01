const { input, select } = require("@inquirer/prompts");

// terminal command
const commands = {
  githubactivity: async () => {
    const username = await input({
      message: "Enter your username: ",
    });

    await fetch(`https://api.github.com/users/${username}/events`)
      .then((resp) => resp.json())
      .then((data) =>
        data.length <= 0
          ? console.log("User provided has no data")
          : console.log("Output: ", data)
      )
      .catch((error) => console.error(error));
    process.exit(0);
  },
  filtergithubactivity: async () => {
    const username = await input({
      message: "Enter your username: ",
    });

    const type = await select({
      message: "Select a status",
      choices: [
        {
          name: "CreateEvent",
          value: "CreateEvent",
          description: "Filter by create.",
        },
        {
          name: "DeleteEvent",
          value: "DeleteEvent",
          description: "Filter by delete.",
        },
        {
          name: "CommitEvent",
          value: "CommitEvent",
          description: "Filter by commit.",
        },
        {
          name: "PushEvent",
          value: "PushEvent",
          description: "Filter by push.",
        },
        {
          name: "PullRequestEvent",
          value: "PullRequestEvent",
          description: "Filter by pull.",
        },
        {
          name: "WatchEvent",
          value: "WatchEvent",
          description: "Filter by watch.",
        },
        {
          name: "IssueEvent",
          value: "IssueEvent",
          description: "Filter by issue.",
        },
        {
          name: "IssueCommentEvent",
          value: "IssueCommentEvent",
          description: "Filter by issue comment.",
        },
        {
          name: "ForkEvent",
          value: "ForkEvent",
          description: "Filter by fork.",
        },
      ],
    });

    await fetch(`https://api.github.com/users/${username}/events`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.length <= 0) {
          console.log("User provided has no data");
        } else {
          const filteredData = data.filter((event) => event.type === type);
          filteredData.length <= 0
            ? console.log("No data for the filtered value")
            : console.log("Filtered output: ", filteredData);
        }
      })
      .catch((error) => console.error(error));
    process.exit(0);
  },
};

// create an asynchronous terminal command
const args = process.argv.slice(2);

if (args.length > 0) {
  const command = args[0];
  if (commands[command]) {
    commands[command]();
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
} else {
  console.error("Usage: node index.js <command>");
  process.exit(1);
}
