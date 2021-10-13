module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "com.abstraction.datasleuth",
                productName: "DataSleuth",
                extraResources: {
                    from: "res",
                    to: "res"
                },
                win: {
                    target: ["nsis"],
                    icon: 'src/assets/DataSleuth.ico'
                },
                nsis: {
                    installerIcon: "src/assets/DataSleuth.ico",
                    uninstallerIcon: "src/assets/DataSleuth.ico",
                    uninstallDisplayName: "DataSleuth",
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                },
                linux: {
                    target: ["deb"],
                    icon: 'src/assets/DataSleuth.png',
                    category: "Utility"
                }
            }
        }
    }
}