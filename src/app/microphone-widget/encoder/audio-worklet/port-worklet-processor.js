class PortProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        console.log(`[Processor:Received] ${event.data.message}`);
    }

    process(inputs, outputs, parameters) {
        // The processor may have multiple inputs and outputs. Get the first input and
        // output.
        let input = inputs[0];
        let output = outputs[0];

        // Each input or output may have multiple channels. Get the first channel.
        let inputChannel0 = input[0];
        let outputChannel0 = output[0];

        this.port.postMessage({
            inputBuffer: inputChannel0,
            outputBuffer: outputChannel0
        });

        return true;
    }
}

registerProcessor("port-processor", PortProcessor);
