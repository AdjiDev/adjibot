const fs = require("fs");
const path = require("path");

module.exports = {
  name: ["plugins"],
  description: "Manage plugins (get, add, edit, delete, check, total)",
  category: ["Owner"],
  forOwner: true,
  async execute(m, client, isOwner) {
    if (!isOwner) return m.reply("This command can only be used by the owner.");

    const args = m.text.trim().split(/ +/).slice(1);
    const command = args[0];
    
    if (!command) return m.reply("Please specify a command: edit, getcode, total, add, delete, check.");

    switch (command.toLowerCase()) {
      case "edit":
        await editPlugin(args.slice(1), m);
        break;
      case "getcode":
        await getCodePlugin(args.slice(1), m);
        break;
      case "total":
        await countPlugins(m);
        break;
      case "add":
        await addPlugin(args.slice(1), m);
        break;
      case "delete":
        await deletePlugin(args.slice(1), m);
        break;
      case "check":
        await checkPlugins(m);
        break;
      default:
        m.reply("Invalid command. Please use: edit, getcode, total, add, delete, check.");
    }
  },
};

// Function to edit a plugin
async function editPlugin(args, m) {
  if (args.length < 2) return m.reply("Usage: /plugins edit <plugin_name> <code>");

  const pluginName = args[0];
  const code = args.slice(1).join(" ");
  const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}.js`);

  try {
    if (fs.existsSync(pluginPath)) {
      fs.writeFileSync(pluginPath, code);
      m.reply(`Plugin ${pluginName} updated successfully!`);
    } else {
      m.reply(`Plugin ${pluginName} not found.`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to edit plugin: ${error.message}`);
    m.reply("An error occurred while editing the plugin.");
  }
}

// Function to get the code of a plugin
async function getCodePlugin(args, m) {
  if (args.length === 0) return m.reply("Usage: /plugins getcode <plugin_name>");

  const pluginName = args[0];
  const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}.js`);

  try {
    if (fs.existsSync(pluginPath)) {
      const code = fs.readFileSync(pluginPath, "utf8");
      m.reply(`\`\`\`javascript\n${code}\n\`\`\``); // Send code as a message
    } else {
      m.reply(`Plugin ${pluginName} not found.`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to get code: ${error.message}`);
    m.reply("An error occurred while retrieving the plugin code.");
  }
}

// Function to count total plugins
async function countPlugins(m) {
  const pluginsDir = path.resolve(__dirname, "../plugins");
  const files = fs.readdirSync(pluginsDir);
  const pluginNames = files
    .filter(file => file.endsWith('.js'))
    .map(file => file.replace('.js', ''));
  
  const total = pluginNames.length;
  const namesList = pluginNames.map((name, index) => `${index + 1}. ${name}`).join("\n");

  m.reply(`Total plugins: ${total}\n\nList:\n${namesList}`);
}

// Function to add a new plugin
async function addPlugin(args, m) {
  if (args.length < 2) return m.reply("Usage: /plugins add <plugin_name> <code>");

  const pluginName = args[0];
  const code = args.slice(1).join(" ");
  const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}.js`);

  try {
    fs.writeFileSync(pluginPath, code);
    m.reply(`Plugin ${pluginName} added successfully!`);
  } catch (error) {
    console.error(`[ERROR] Failed to add plugin: ${error.message}`);
    m.reply("An error occurred while adding the plugin.");
  }
}

// Function to delete a plugin
async function deletePlugin(args, m) {
  if (args.length === 0) return m.reply("Usage: /plugins delete <plugin_name>");

  const pluginName = args[0];
  const pluginPath = path.resolve(__dirname, `../plugins/${pluginName}.js`);

  // Check if the plugin name starts with an underscore (system plugin)
  if (pluginName.startsWith("_")) {
    return m.reply(`Plugin ${pluginName} is a system plugin and cannot be deleted.`);
  }

  try {
    if (fs.existsSync(pluginPath)) {
      fs.unlinkSync(pluginPath);
      m.reply(`Plugin ${pluginName} deleted successfully!`);
    } else {
      m.reply(`Plugin ${pluginName} not found.`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to delete plugin: ${error.message}`);
    m.reply("An error occurred while deleting the plugin.");
  }
}

// Function to check all plugins for errors
async function checkPlugins(m) {
  const pluginsDir = path.resolve(__dirname, "../plugins");
  const files = fs.readdirSync(pluginsDir);
  const errors = [];

  for (const file of files) {
    if (file.endsWith('.js')) {
      const pluginPath = path.join(pluginsDir, file);
      try {
        require(pluginPath);
      } catch (error) {
        errors.push(`Error in ${file}: ${error.message}`);
      }
    }
  }

  if (errors.length > 0) {
    m.reply(`Found ${errors.length} errors:\n${errors.join("\n")}`);
  } else {
    m.reply("No errors found in plugins.");
  }
}
