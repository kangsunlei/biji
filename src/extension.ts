import * as vscode from "vscode";

class WebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "webview-embed.webview";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    const config = vscode.workspace.getConfiguration("webview-embed");
    const defaultUrl =
      config.get<string>("defaultUrl") || "https://www.google.com";

    webviewView.webview.html = this.getWebviewContent(defaultUrl);
  }

  public updateUrl(url: string) {
    if (this._view) {
      this._view.webview.html = this.getWebviewContent(url);
    }
  }

  private getWebviewContent(url: string): string {
    return getWebviewContent(url);
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  const provider = new WebviewProvider(context.extensionUri);

  // 注册 webview 视图提供者
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WebviewProvider.viewType,
      provider
    )
  );

  // 注册打开 webview 命令
  const openWebviewCommand = vscode.commands.registerCommand(
    "webview-embed.openWebview",
    async () => {
      // 显示侧边栏视图
      vscode.commands.executeCommand("webview-embed.webview.focus");
    }
  );

  // 注册设置 URL 命令
  const setUrlCommand = vscode.commands.registerCommand(
    "webview-embed.setUrl",
    async () => {
      const url = await vscode.window.showInputBox({
        prompt: "请输入要打开的网页地址",
        placeHolder: "https://example.com",
        validateInput: (value: string) => {
          if (!value) {
            return "请输入网页地址";
          }
          try {
            new URL(value);
            return null;
          } catch {
            return "请输入有效的网页地址";
          }
        },
      });

      if (url) {
        // 更新配置
        const config = vscode.workspace.getConfiguration("webview-embed");
        await config.update(
          "defaultUrl",
          url,
          vscode.ConfigurationTarget.Global
        );

        // 更新视图内容
        provider.updateUrl(url);

        vscode.window.showInformationMessage(`网页地址已设置为: ${url}`);
      }
    }
  );

  context.subscriptions.push(openWebviewCommand, setUrlCommand);
};

const getWebviewContent = (url: string): string => {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>内嵌网页</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .toolbar {
            background-color: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .url-input {
            flex: 1;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 4px 8px;
            border-radius: 2px;
            font-size: 12px;
        }
        .btn {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 4px 8px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        }
        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .iframe-container {
            flex: 1;
            position: relative;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

    </style>
</head>
<body>
    <div class="toolbar">
        <input type="text" class="url-input" id="urlInput" value="${url}" placeholder="输入网页地址">
        <button class="btn" onclick="loadUrl()">加载</button>
        <button class="btn" onclick="refresh()">刷新</button>
    </div>
    <div class="iframe-container">
        <iframe id="webFrame" src="${url}"></iframe>
    </div>

    <script>
        function loadUrl() {
            const input = document.getElementById('urlInput');
            const iframe = document.getElementById('webFrame');
            if (input.value) {
                iframe.src = input.value;
            }
        }
        
        function refresh() {
            const iframe = document.getElementById('webFrame');
            iframe.src = iframe.src;
        }
        
        // 监听 Enter 键加载 URL
        document.getElementById('urlInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadUrl();
            }
        });
    </script>
</body>
</html>`;
};

export const deactivate = () => {
  // 清理资源
};
