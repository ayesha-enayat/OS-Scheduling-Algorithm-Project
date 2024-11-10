const prompt = require('prompt-sync')(); // Require prompt-sync module for user input

// Function to take input for execution time of each process
function getProcessInfo(numberOfProcesses) {
    let processInfoArray = [];
    for (let i = 0; i < numberOfProcesses; i++) {
        let executionTime = parseInt(prompt(`Enter execution time for process ${i + 1} (1-10): `));

        while (isNaN(executionTime) || executionTime < 1 || executionTime > 10) {
            console.log("Invalid input. Execution time must be a number between 1 and 10.");
            executionTime = parseInt(prompt(`Enter execution time for process ${i + 1} (1-10): `));
        }

        processInfoArray.push({
            processID: `P${i + 1}`,
            executionTime: executionTime,
            arrivalTime: i,  // Set arrival time based on process index
            remainingTime: executionTime,
            startTime: -1,
            finishTime: -1,
            waitTime: 0,
            turnAroundTime: 0,
            utilization: 0,
            responseRatio: 0
        });
    }
    return processInfoArray;
}

// Function to apply First-Come, First-Served scheduling
function firstComeFirstServed(processInfoArray) {
    let currentTime = 0;
    let executionOrder = [];

    for (let process of processInfoArray) {
        process.startTime = currentTime;
        process.waitTime = currentTime - process.arrivalTime;
        
        // Push the process ID multiple times based on its execution time
        for (let i = 0; i < process.executionTime; i++) {
            executionOrder.push(process.processID);
        }
        
        currentTime += process.executionTime;
        process.finishTime = currentTime;
        process.turnAroundTime = process.finishTime - process.arrivalTime;
        process.utilization = ((process.executionTime / process.turnAroundTime) * 100).toFixed(2);
    }

    // Print the execution order
    console.log("\nProcess Execution Order (FCFS):");
    console.log(executionOrder.join(" "));
    printProcessInfo("FCFS", processInfoArray);
}

// Function to apply Shortest Job First (SJF) scheduling
function shortestJobFirst(processInfoArray) {
    let currentTime = 0;
    let completedProcesses = 0;
    let n = processInfoArray.length;
    let executionOrder = [];

    // Sort processes by arrival time
    processInfoArray.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Loop until all processes are completed
    while (completedProcesses < n) {
        // Find the process with the shortest execution time that has arrived
        let shortestProcess = null;
        for (let process of processInfoArray) {
            if (process.arrivalTime <= currentTime && process.finishTime === -1) {
                if (shortestProcess === null || process.executionTime < shortestProcess.executionTime) {
                    shortestProcess = process;
                }
            }
        }

        // If there's no process ready, increment time
        if (shortestProcess === null) {
            currentTime++;
            continue;
        }

        // Set the start time for the selected process if it hasn't started
        if (shortestProcess.startTime === -1) {
            shortestProcess.startTime = currentTime;
        }

        // Execute the process to completion
        for (let i = 0; i < shortestProcess.executionTime; i++) {
            executionOrder.push(shortestProcess.processID);
        }
        
        currentTime += shortestProcess.executionTime;

        // Mark the process as completed and calculate times
        shortestProcess.finishTime = currentTime;
        shortestProcess.turnAroundTime = shortestProcess.finishTime - shortestProcess.arrivalTime;
        shortestProcess.waitTime = shortestProcess.turnAroundTime - shortestProcess.executionTime;
        shortestProcess.utilization = ((shortestProcess.executionTime / shortestProcess.turnAroundTime) * 100).toFixed(2);
        completedProcesses++;
    }

    // Print the execution order
    console.log("\nProcess Execution Order (SJF):");
    console.log(executionOrder.join(" "));
    printProcessInfo("SJF", processInfoArray);
}
   
// Function to apply Shortest Remaining Time (SRT) scheduling
function shortestRemainingTime(processInfoArray) {
    let currentTime = 0;
    let completed = 0;
    let n = processInfoArray.length;
    let executionOrder = [];

    while (completed < n) {
        let shortestProcess = processInfoArray
            .filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0)
            .sort((a, b) => a.remainingTime - b.remainingTime)[0];

        if (!shortestProcess) {
            currentTime++;
            continue;
        }

        if (shortestProcess.startTime === -1) {
            shortestProcess.startTime = currentTime;
        }

        shortestProcess.remainingTime--;
        executionOrder.push(shortestProcess.processID);
        currentTime++;

        if (shortestProcess.remainingTime === 0) {
            completed++;
            shortestProcess.finishTime = currentTime;
            shortestProcess.turnAroundTime = shortestProcess.finishTime - shortestProcess.arrivalTime;
            shortestProcess.waitTime = shortestProcess.turnAroundTime - shortestProcess.executionTime;
            shortestProcess.utilization = ((shortestProcess.executionTime / shortestProcess.turnAroundTime) * 100).toFixed(2);
        }
    }

    console.log("\nProcess Execution Order (SRT):");
    console.log(executionOrder.join(" "));
    printProcessInfo("SRT", processInfoArray);
}

// Function to apply Highest Response Ratio Next (HRRN) scheduling
function highestResponseRatioNext(processInfoArray) {
    let currentTime = 0;
    let completed = 0;
    let n = processInfoArray.length;
    let executionOrder = [];

    while (completed < n) {
        processInfoArray.forEach(p => {
            if (p.arrivalTime <= currentTime && p.finishTime === -1) {
                p.responseRatio = (currentTime - p.arrivalTime + p.executionTime) / p.executionTime;
            }
        });

        let highestRRProcess = processInfoArray
            .filter(p => p.arrivalTime <= currentTime && p.finishTime === -1)
            .sort((a, b) => b.responseRatio - a.responseRatio)[0];

        if (!highestRRProcess) {
            currentTime++;
            continue;
        }

        highestRRProcess.startTime = currentTime;
        
        for (let i = 0; i < highestRRProcess.executionTime; i++) {
            executionOrder.push(highestRRProcess.processID);
        }
        
        currentTime += highestRRProcess.executionTime;
        highestRRProcess.finishTime = currentTime;
        highestRRProcess.turnAroundTime = highestRRProcess.finishTime - highestRRProcess.arrivalTime;
        highestRRProcess.waitTime = highestRRProcess.turnAroundTime - highestRRProcess.executionTime;
        highestRRProcess.utilization = ((highestRRProcess.executionTime / highestRRProcess.turnAroundTime) * 100).toFixed(2);
        completed++;
    }

    console.log("\nProcess Execution Order (HRRN):");
    console.log(executionOrder.join(" "));
    printProcessInfo("HRRN", processInfoArray);
}

// Helper function to print process information
function printProcessInfo(algorithm, processInfoArray) {
    console.log(`\n=== ${algorithm} Process Information ===`);
    console.log("------------------------------------------------------------------------");
    console.log("Process\tArrival\tBurst\tStart\tWait\tFinish\tTurnaround\tUtilization");
    console.log("ID\tTime\tTime\tTime\tTime\tTime\tTime\t\t%");
    console.log("-------------------------------------------------------------------------");

    processInfoArray.forEach(process => {
        console.log(`${process.processID}\t${process.arrivalTime}\t${process.executionTime}\t${process.startTime}\t${process.waitTime}\t${process.finishTime}\t${process.turnAroundTime}\t\t${process.utilization}%`);
    });
}

// Main code execution
(function main() {
    let numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));

    while (isNaN(numberOfProcesses) || numberOfProcesses < 1 || numberOfProcesses > 5) {
        console.log("Invalid input. Number of processes must be between 1 and 5.");
        numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));
    }

    let processInfoArray = getProcessInfo(numberOfProcesses);

    // Loop to keep prompting for an algorithm choice until -1 is entered
    while (true) {
        console.log("\nChoose a scheduling algorithm (or enter -1 to exit):");
        console.log("1. First Come First Served (FCFS)");
        console.log("2. Shortest Job First (SJF)");
        console.log("3. Shortest Remaining Time (SRT)");
        console.log("4. Highest Response Ratio Next (HRRN)");

        let choice = parseInt(prompt("Enter your choice (1-4) : "));
        console.log("\n\n"); // Add spacing after each run

        // Check if the user wants to exit
        if (choice === -1) {
            console.log("Exiting the program.");
            break;
        }

        // Run the chosen scheduling algorithm
        switch (choice) {
            case 1:
                console.log('FIRST COME FIRST SERVED');
                firstComeFirstServed(JSON.parse(JSON.stringify(processInfoArray)));
                break;
            case 2:
                console.log('SHORTEST JOB FIRST');
                shortestJobFirst(JSON.parse(JSON.stringify(processInfoArray)));
                break;
            case 3:
                console.log('SHORTEST REMAINING TIME');
                shortestRemainingTime(JSON.parse(JSON.stringify(processInfoArray)));
                break;
            case 4:
                console.log('HIGHEST RESPONSE RATIO NEXT');
                highestResponseRatioNext(JSON.parse(JSON.stringify(processInfoArray)));
                break;
            default:
                console.log("Invalid choice. Please select a valid option or enter -1 to exit.");
                break;
        }

        console.log("\n\n"); // Add spacing after each run
    }
})();
