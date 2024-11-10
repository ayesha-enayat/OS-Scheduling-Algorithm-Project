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

// Function to apply Highest Response Ratio Next (HRRN) scheduling
function highestResponseRatioNext(processInfoArray) {
    let currentTime = 0;
    let completedProcesses = 0;
    let n = processInfoArray.length;
    let executionOrder = [];

    // Loop until all processes are completed
    while (completedProcesses < n) {
        // Find the process with the highest response ratio that has arrived
        let highestRatioProcess = null;
        let highestRatio = -1;

        for (let process of processInfoArray) {
            if (process.arrivalTime <= currentTime && process.finishTime === -1) {
                let waitingTime = currentTime - process.arrivalTime;
                let responseRatio = (waitingTime + process.executionTime) / process.executionTime;

                if (responseRatio > highestRatio) {
                    highestRatio = responseRatio;
                    highestRatioProcess = process;
                }
            }
        }

        // If there's no process ready, increment time
        if (highestRatioProcess === null) {
            currentTime++;
            continue;
        }

        // Set the start time for the selected process if it hasn't started
        if (highestRatioProcess.startTime === -1) {
            highestRatioProcess.startTime = currentTime;
        }

        // Execute the process to completion
        executionOrder.push(highestRatioProcess.processID);
        currentTime += highestRatioProcess.executionTime;

        // Mark process as completed
        highestRatioProcess.finishTime = currentTime;
        highestRatioProcess.turnAroundTime = highestRatioProcess.finishTime - highestRatioProcess.arrivalTime;
        highestRatioProcess.waitTime = highestRatioProcess.turnAroundTime - highestRatioProcess.executionTime;
        // Calculate individual process utilization
        highestRatioProcess.utilization = ((highestRatioProcess.executionTime / highestRatioProcess.turnAroundTime) * 100).toFixed(2);

        completedProcesses++;
    }

    // Print the execution order
    console.log("\nProcess Execution Order (HRRN):");
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

    // Apply HRRN scheduling
    highestResponseRatioNext(processInfoArray);

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
