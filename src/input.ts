import * as readline from 'readline';

export function askForMyCity(): Promise<string> {

    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {

        r1.question(
            'Enter the name of the city you want the weather of: ',
            (answer) => {

                r1.close();

                resolve(answer.trim());
            }
        );
    });
}