/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
 // Include Alexa ask-sdk-core and assign it to a const
const Alexa = require('ask-sdk-core');
// Create a variable to hold goodbye message
var goodbyes = ["bye", "later", "peace", "farewell", "see ya", "cya", "adios", "peace out"];
// Create a variable to hold welcome message
var welcomes = ["Howdy", "Hi", "Hello"];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        // create const for speakWelcomeOutput for welcome message
        const speakWelcomeOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB"><amazon:emotion name="excited" intensity="medium"> ' + getHello() + '  and welcome to the Urban Dictionary skill.</amazon:emotion>  You can ask a question like, what is the meaning of cleveland steamer? ... Now, what can I help you with. </lang></voice></speak>';
        const repromptOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB">Try saying define butt plug for example.</lang></voice></speak>';
        return handlerInput.responseBuilder
            .speak(speakWelcomeOutput)
            .reprompt(repromptOutput)
            .getResponse();
    } // End HandlerInput
};

const GetDefinationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetDefinationIntent';
    },
    async handle(handlerInput) {
        // Create a blank speech var for use later
        var speech = '';
        // Create a blank defination variable for later
        var defination = '';
        // Create a blank randomDef for use later
        var randomDef = '';
        // Define const for repromptText
        const repromptText = '<speak><voice name="Brian"><lang xml:lang="en-GB">Feel free to ask for another term</lang></voice></speak>';

        await getRemoteData('http://api.urbandictionary.com/v0/define?term=' + handlerInput.requestEnvelope.request.intent.slots.Term.value)
            .then((response) => {
                // Create const called data to store the JSON parsed response
                const data = JSON.parse(response);
                // Grab a random defination from the definitions returned
                randomDef = randomInt(0, data.list.length)
                // Create a var for the for the word definition store it in cleanDefnination replacing new lines with chracter returns
                var cleanDefinition = data.list[randomDef].definition.replace(/\n/g, '').replace(/\r/g, '').replace("fuck","f'uck").replace("fucking","fuck'ing").replace("rim job","r'im job").replace("asshole","a'sshole");
                // Create a var for cleanexample replacing new lines with chracter returns
                var cleanExample = data.list[randomDef].example.replace(/\n/g, '').replace(/\r/g, '').replace("fuck","f'uck").replace("fucking","fuck'ing").replace("rim job","r'im job").replace("asshole","a'sshole");
                // Create a var to store the word and do some replacing of swear words
                var word = data.list[randomDef].word
                // store a cleaned up message to return in the StandardCard later
                defination = "Defination: " + cleanDefinition + " \n Example: " + cleanExample;
                // Build out the speech output
                speech = "" +
                    "<speak> <voice name=\"Brian\"><lang xml:lang=\"en-GB\">" +
                    "<p>" + word + ":" + "<break time='0.5s'/>" + cleanDefinition + "</p>" +
                    "<p>" + "Here is example number "+ randomDef + ":" + "<break time='0.5s'/>" + cleanExample + "</p>" +
                    "</lang> </voice> </speak>";
            })
            .catch((error) => {
                console.log(`Error handled: ${error.message}`);
                console.log(`Error stack: ${error.stack}`);

                // set an optional error message here
                // outputSpeech = err.message;
            });

        return handlerInput.responseBuilder
            // Speak out the definition
            .speak(speech)
            // Output repromptText
            .reprompt(repromptText)
            // Output the standardCard
            .withStandardCard("Urban Dictonary", defination)
            .getResponse();

    } // End HandlerInput
};

const GetRandomDefinationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetRandomDefination';
    },
    async handle(handlerInput) {
      // Create a blank speech var for use later
      var speech = '';
      // Create a blank defination variable for later
      var defination = '';
      // Create a blank randomDef for use later
      var randomDef = '';
      // Create const for repromptText
    //  const repromptText = "Do you want to get another random term?";

        await getRemoteData('http://api.urbandictionary.com/v0/random')
            .then((response) => {
                // Create const called data to store the JSON parsed response
                const data = JSON.parse(response);
                // Grab a random defination from the definitions returned
                randomDef = randomInt(0, data.list.length)
                // Create a var for the word example store it in cleanExample replacing new lines with chracter returns
                var cleanDefinition = data.list[randomDef].definition.replace(/\n/g, '').replace(/\r/g, '').replace("fuck","f'uck").replace("fucking","fuck'ing").replace("rim job","r'im job").replace("asshole","a'sshole");
                // Create a var for cleanexample replacing new lines with chracter returns
                var cleanExample = data.list[randomDef].example.replace(/\n/g, '').replace(/\r/g, '').replace("fuck","f'uck").replace("fucking","fuck'ing").replace("rim job","r'im job").replace("asshole","a'sshole");
                // Create a var to store the word and do some replacing of swear words
                var word = data.list[randomDef].word
                // store a cleaned up message to return in the StandardCard later
                defination = "Defination: " + cleanDefinition + " \n Example: " + cleanExample;
                // Build out the speech output
                speech = "" +
                "<speak><voice name=\"Brian\"><lang xml:lang=\"en-GB\">" +
                "<p>" + word + ":" + "<break time='0.5s'/>" + cleanDefinition + "</p>" +
                "<p>" + "Here is example number "+ randomDef + ":" + "<break time='0.5s'/>" + cleanExample + "</p>" +
                "</lang></voice></speak>";
            })
            .catch((error) => {
                console.log(`ERROR: ${error.message}`);
                // set an optional error message here
                // outputSpeech = error.message;
            });


        return handlerInput.responseBuilder
            // Output speach
            .speak(speech).shouldEndSession(false)
            // Output repromptText
            //.reprompt(repromptText)
            // Output the standardCard
            .withStandardCard("Urban Dictonary", defination)
            .getResponse();

    } // End HandlerInput
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB"> You can ask for popular terms  such as, what is the meaning of cleveland steamer, or, you can say exit... Now, what can I help you with? </lang></voice></speak>';
        const repromptText = '<speak><voice name="Brian"><lang xml:lang="en-GB">Try saying define tug boat </lang></voice></speak>';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    } // End HandlerInput
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speakOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB">' + getGoodbye() + ' </lang></voice></speak>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    } // End HandlerInput
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB"><amazon:emotion name="disappointed" intensity="medium">Sorry, I don\'t know about that. Please try again.</amazon:emotion></lang></voice></speak>';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    } // End HandlerInput
}; // End FallbackIntentHandler const
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder
        .getResponse(); // notice we send an empty response
    } // End HandlerInput
}; // End SessionEndedRequestHandler const
/*
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    } // End HandlerInput
}; // End IntentReflectorHandler const
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        // Create const for speakOutput
        const speakOutput = '<speak><voice name="Brian"><lang xml:lang="en-GB"><amazon:emotion name="disappointed" intensity="medium">Sorry, I had trouble doing what you asked. Please try again.</amazon:emotion></lang></voice></speak>';
        // Output error to console
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        // Return handlerInput.responseBuilder
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    } // End HandlerInput
}; // End ErrorHandler const

// Create const for getRemotedata
const getRemoteData = (url) => new Promise((resolve, reject) => {
   // Create const to store client data specifiying either http or https depending on URL provided
    const client = url.startsWith('https') ? require('https') : require('http');
    // Create const to store the request response
    const request = client.get(url, (response) => {
        // If the reponse is less than 200 or greater than 299 for the httpresponse code reject with the error
        if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error(`Failed with status code: ${response.statusCode}`));
        }
        // Create a const to store the body of the response
        const body = [];
        // Push the data reponse into the body array
        response.on('data', (chunk) => body.push(chunk));
        // Push the data end response into the body array
        response.on('end', () => resolve(body.join('')));
    });

    request.on('error', (err) => reject(err));
});

function getHello() {
    return welcomes[randomInt(0, welcomes.length)];
} // End getHello function

function getGoodbye() {
    return goodbyes[randomInt(0, goodbyes.length)];
} // End getGoodbye function

function randomInt(low, high) {
    return Math.floor(Math.random() * high);
} // End randomInt function

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetDefinationIntentHandler,
        GetRandomDefinationIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('urbandictonary/v1.2')
    .lambda();
