// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path')
const fs = require('fs')

function PopulateFile(file_path) {
    let cpp_path = file_path + ".cpp";
    let h_path = file_path + ".h";
    let cpp_base_file = path.basename(cpp_path);
    let h_base_file = path.basename(h_path);
    let class_name = path.basename(file_path);

    let boilerplate = `//================================================================================
/// \\file ${cpp_base_file}
///
/// \\TODO COPYRIGHT
//================================================================================

#include "${h_base_file}"

//================================================================================
${class_name}::${class_name}()
{
}

//================================================================================
${class_name}::~${class_name}()
{
}
`;

    fs.appendFile(cpp_path, boilerplate, (err) => {
    });

    boilerplate = `#pragma once
//================================================================================
/// \\file ${h_base_file}
///
/// \\TODO COPYRIGHT
//================================================================================

//================================================================================
/// \\TODO Class description
///
class ${class_name}
{
public:
    ${class_name}();
    ~${class_name}();
};
`;

    fs.appendFile(h_path, boilerplate, (err) => {
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.CreateClass', context_path => {
        // The code you place here will be executed every time your command is executed

        let dir_path = context_path.fsPath;
        if (path.extname(context_path.fsPath) !== "") {
            dir_path = context_path.fsPath.replace(path.basename(context_path.fsPath), "");
        }

        if (dir_path.charAt(dir_path.length - 1) === '/') {
            dir_path = dir_path.slice(0, dir_path.length - 1);
        }

        vscode.window.showInputBox({placeHolder: "Class Name", prompt: "Input the name of your class."}).then(class_name => {
            if (typeof(class_name) === "undefined") {
                console.log("No class name given");
                return
            }

            let full_file_path = dir_path + "/" + class_name;
            if (!fs.existsSync(full_file_path + ".cpp") && !fs.existsSync(full_file_path + ".h")) {
                fs.appendFile(full_file_path + ".cpp", '', (err) => {
                    fs.appendFile(full_file_path + ".h", '', (err) => {
                        PopulateFile(full_file_path);
                    });
                });
            }
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;