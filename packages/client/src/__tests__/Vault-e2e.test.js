/**
 * @jest-environment node
 */
import spectron from 'spectron'
import { testWithSpectron } from 'vue-cli-plugin-electron-builder'
import fs from "fs";
import * as dotenv from "dotenv";
import {randomBytes} from "crypto";
jest.setTimeout(50000)

try {
    fs.readFileSync(__dirname + `/../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../.env`});
    console.log(__dirname);
} catch (e) {}


describe("Vault Functionality and Security", () => {

    let spectronTest;
    let win;
    let client;

    let email = "test" + randomBytes(9).toString('hex') + "@" + randomBytes(7).toString('hex') + ".com";
    let password = randomBytes(14).toString('hex');
    let name = randomBytes(7).toString('hex');

    test('Window Loads Properly', async () => {
        // Wait for dev server to start
        spectronTest = await testWithSpectron(spectron)
        win = spectronTest.app.browserWindow
        client = spectronTest.app.client

        // Window was created
        expect(await client.getWindowCount()).toBe(1)
        // It is not minimized
        expect(await win.isMinimized()).toBe(false)
        // Window is visible
        expect(await win.isVisible()).toBe(true)
        // Size is correct
        const {width, height} = await win.getBounds()
        expect(width).toBeGreaterThan(0)
        expect(height).toBeGreaterThan(0)
        // App is loaded properly
    })

    test('Register A User', async () => {

        const addUserButton = await client.$('#add-user-card');
        await addUserButton.click();

        const nameField = await client.$('#Name');
        await nameField.setValue(name);

        const emailField = await client.$('#Email');
        await emailField.setValue(email);

        const passwordField = await client.$('#masterPassword');
        await passwordField.setValue(password);

        const checkPasswordField = await client.$('#masterPassCheck');
        await checkPasswordField.setValue(password);

        const vaultCheckBox = await client.$('.p-checkbox-box');
        await vaultCheckBox.click();

        const registerButton = await client.$('#btnRegister');
        await registerButton.click();

        let elem = await client.$('#sidebar');
        let isExisting = await elem.isExisting();

        const goToSearchButton = await client.$('#gotoSearch');
        await goToSearchButton.click();

        expect(isExisting).toBe(true);

        await new Promise((r) => setTimeout(r, 3000));
    })

    test('Delete The User', async () => {

        const profileButton = await client.$('#user-profile-btn');
        await profileButton.click();

        const signOutButton = await client.$('#sign-out-btn');
        await signOutButton.click();


        const confirmSignOutButton = await client.$('#confirm-sign-out');
        await confirmSignOutButton.click();

        const user = await client.$('.user-container');
        await user.click({button: 2});

        const removeButton = await client.$('a.p-menuitem-link');
        await removeButton.click();

        const dButton = await client.$('#confirm-user-deletion-btn');
        await dButton.click();

        const vaultCheckBox = await client.$('.p-radiobutton-box');
        await vaultCheckBox.click();

        const dButtonVault = await client.$('#confirm-user-deletion-btn-vault');
        await dButtonVault.click();


    })

    test('Sign In To Remote User', async () => {

        const addUserButton = await client.$('#add-user-card');
        await addUserButton.click();

        const vEmailField = await client.$('#emailVault');
        await vEmailField.setValue(email);

        const passwordField = await client.$('#password');
        await passwordField.setValue(password);

        const remoteSignInButton = await client.$('#signin-remote-btn');
        await remoteSignInButton.click();

        let elem = await client.$('#sidebar');
        let isExisting = await elem.isExisting();

        expect(isExisting).toBe(true);

        await new Promise((r) => setTimeout(r, 3000));

        await spectronTest.stopServe();
    })
})

