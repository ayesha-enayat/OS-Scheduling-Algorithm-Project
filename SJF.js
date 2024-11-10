const prompt = require('prompt-sync')(); // Require the prompt-sync module for user input

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
            startTime: -1,
            finishTime: -1,
            waitTime: 0,
            turnAroundTime: 0,
            utilization: 0  // Utilization initialized to 0
        });
    }
    return processInfoArray;
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
        executionOrder.push(shortestProcess.processID);
        currentTime += shortestProcess.executionTime;

        // Mark the process as completed and calculate times
        shortestProcess.finishTime = currentTime;
        shortestProcess.turnAroundTime = shortestProcess.finishTime - shortestProcess.arrivalTime;
        shortestProcess.waitTime = shortestProcess.turnAroundTime - shortestProcess.executionTime;
        // Calculate individual process utilization
        shortestProcess.utilization = ((shortestProcess.executionTime / shortestProcess.turnAroundTime) * 100).toFixed(2);
        completedProcesses++;
    }

    // Print the execution order
    console.log("\nProcess Execution Order (SJF):");
    console.log(executionOrder.join(" "));
}

// Main code execution
(function main() {
    // Input number of processes
    let numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));

    while (isNaN(numberOfProcesses) || numberOfProcesses < 1 || numberOfProcesses > 5) {
        console.log("Invalid input. Number of processes must be between 1 and 5.");
        numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));
    }

    // Get process information from the user
    let processInfoArray = getProcessInfo(numberOfProcesses);

    // Apply SJF scheduling
    shortestJobFirst(processInfoArray);

    // Print final process information
    console.log("\n========================================");
    console.log("Final Process Information:");
    console.log("---------------------------------------------------------------");
    console.log("Process\tArrival\tStart\tWait\tFinish\tTurnaround\tUtilization");
    console.log("ID\tTime\tTime\tTime\tTime\tTime\t\t%");
    console.log("---------------------------------------------------------------");

    processInfoArray.forEach(processInfo => {
        console.log(`${processInfo.processID}\t${processInfo.arrivalTime}\t${processInfo.startTime}\t${processInfo.waitTime}\t${processInfo.finishTime}\t${processInfo.turnAroundTime}\t\t${processInfo.utilization}%`);
    });
})();
