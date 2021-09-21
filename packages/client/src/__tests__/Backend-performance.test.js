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


describe("Backend Performance", () => {

    let spectronTest;
    let win;
    let client;

    let email = process.env.DS_TEST_EDITOR_EMAIL
    let password = process.env.DS_TEST_EDITOR_PW

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



    test('Sign In To Test User', async () => {

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

    })

    test('Test Search Time', async () => {

        const search  = await client.$('input.p-inputtext.p-component');
        await search.setValue("Orange");

        const searchButton = await client.$('i.pi');
        await searchButton.click();

        const start = Date.now();

        const resultCard = await client.$('.result-card');
        await resultCard.waitForExist({ timeout: 10000 });

        const end = Date.now();
        console.log(`Execution time: ${end - start} ms`);

        expect(end-start).toBeLessThanOrEqual(2000);

        await spectronTest.stopServe();
    })

})

