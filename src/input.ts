import * as readline from 'readline'; // allows the program to read what a user types into the terminal.

                                //means, this function will eventually give us a string
                                //reason: a response from the user is required
export function askForMyCity(): Promise<string> {

    // creates a readline interface that is responsible for communicating with the terminal.
    const rl = readline.createInterface({
        input: process.stdin, 
        output: process.stdout 
    }); // Read from the keyboard and display things in the terminal.

    return new Promise((resolve) => {

        // Asks the question in the terminal, then gives an answer in the terminal.
        rl.question(
            '\nEnter the name of the city you want the weather of: ',
            (answer) => {

                // without this the program code wait indefinitely for more input.
                rl.close(); // We're finished asking the user for the input.

                resolve(answer.trim()); // The user has answered, return their cleaned-up city name.
            }

        );

    }); // I don't have th city yet, the user still needs to type it. Once they do, I'll give you the answer.
}

// Create a function called askForMyCityCallback.
// It receives another function called callback, that receives a city string.
// askForMyCityCallback, returns nothing (void)
export function askForMyCityCallback(
    callback: (city: string) => void 
): void {

    const rl = readline.createInterface({

        input: process.stdin,
        output: process.stdout

    }); // Read from the keyboard and display things in the terminal.

    rl.question(
        
        '\nEnter the name of the city you want the weather of: ',
        (answer) => {

            rl.close();

            callback(answer.trim());
        }

    );
    
}