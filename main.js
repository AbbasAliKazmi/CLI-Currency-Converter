#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
const sleep = () => {
    return new Promise((res) => {
        setTimeout(res, 2000);
    });
};
async function welcome() {
    let pulseAnimation = chalkAnimation.rainbow('Welcome to Your Todos');
    await sleep();
    pulseAnimation.stop();
    console.log(chalk.yellowBright(`

    .d8888b8  88  8888  88d8888  88d888  .d88b.  88888b.     .d8888b    888  888 
    d88P"     888  888  888P"    888P"  d8P  Y8b  888 "88b   d88P"      888  888 
    888       888  888  888      888    88888888  888  888   888        888  888 
    Y88b.     Y88b 888  888      888    Y8b.      888  888   Y88b.      Y88b 888 
     "Y8888P   "Y88888  888      888     "Y8888   888  888    "Y8888P    "Y88888 
                                                                            888 
                                                                       Y8b d88P 
                                                                        "Y88P"  

 `));
}
await welcome();
const fakeExchangeRates = [
    { currency: 'USD', rate: 1.0 },
    { currency: 'EUR', rate: 0.85 },
    { currency: 'GBP', rate: 0.73 },
    { currency: 'PKR', rate: 284.75 },
    { currency: 'INR', rate: 74.23 },
];
async function fetchExchangeRates() {
    try {
        return fakeExchangeRates;
    }
    catch (error) {
        throw new Error('Failed to fetch exchange rates.');
    }
}
async function convertCurrency() {
    const exchangeRates = await fetchExchangeRates();
    const repeatTask = async () => {
        const questions = [
            {
                type: 'input',
                name: 'amount',
                message: chalk.bgGrey.bold('Enter the amount to convert:'),
                validate: (value) => {
                    const parsedValue = parseFloat(value);
                    return !isNaN(parsedValue) && parsedValue >= 0;
                },
            },
            {
                type: 'list',
                name: 'fromCurrency',
                message: chalk.redBright.bold('Select the source currency:'),
                choices: exchangeRates.map(rate => rate.currency),
            },
            {
                type: 'list',
                name: 'toCurrency',
                message: chalk.bgGray.bold('Select the target currency:'),
                choices: exchangeRates.map(rate => rate.currency),
            },
        ];
        const answers = await inquirer.prompt(questions);
        const { amount, fromCurrency, toCurrency } = answers;
        const fromRate = exchangeRates.find(rate => rate.currency === fromCurrency)?.rate || 1;
        const toRate = exchangeRates.find(rate => rate.currency === toCurrency)?.rate || 1;
        const convertedAmount = (parseFloat(amount) / fromRate) * toRate;
        console.log(chalk.greenBright(`${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}`));
        setTimeout(async () => {
            const { repeat } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'repeat',
                    message: chalk.bgGray.bold('Do you want to perform another conversion?'),
                },
            ]);
            if (repeat) {
                await repeatTask();
            }
            else {
                console.log('Exiting the app.');
            }
        }, 2000);
    };
    await repeatTask();
}
convertCurrency();
