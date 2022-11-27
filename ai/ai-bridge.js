const aiPlatform = require('@google-cloud/aiplatform');
const {instance, params, prediction} = aiPlatform.protos.google.cloud.aiplatform.v1.schema.predict;

const {PredictionServiceClient} = aiPlatform.v1;

const projectId = 'temporal-studio-339115';
const location = 'us-central1';
// const endpointId = '7083238624086458368';

const clientOptions = {
    projectId: projectId,
    keyFilename: './secret/vertex-service-account.json',
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

async function toggleEndpoint() {

}

async function predictImageClassification(endpointId = '7083238624086458368', base64Image) {

    base64Image = base64Image.replace('data:image/jpeg;base64,', '');
    // base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAHgAAAAtCAYAAABlJ6+WAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAASfSURBVHic7ZzbdqIwFIb/HACpvev7P2RX1SUk2ZmLWTuzG60DCBix35WrlVP+7GOCKsYY8R9ijCAiEBFCCCAiKKVgjIFSCkopAEh/GwIRAQC01oO+fw3nHACgqqrJ5xgCESHGCK11eta54OGf+7yMGiLwWowVfenBYdYUeI6JL7GznOVBLC0sM9dgX2PpZ1jdgqfM0LUs9ZEs9Yya4+o9OscY7zr+VXjEOA120fLG5Gel1KDZx9+Z4u62Yrm3xmmpZ7QARiUPPAvl9x8twL3uLZ+8IQQAgLV21mfjc60ZcgZbcC7omAmRH186PInziZwzNp/IBV6DxZOs/wksBzL/zlyWOfb4W/ckmbukWYLFy6RnslxmqIfSWiOEgNPpBCJCVVWoqqoowYtqdDwbXdfhdDqh73sAfwV/e3tD27bFiPwr8ETO5zMOhwOUUqjrGlprOOfgnMNut8N+vy9CZOucW7yXuzWICF9fXwgh4OPjI40fEeHz8zNl4SWw+hTbQlOEG0NN03wzDnbRSqnkth+N/rXe8fDCw7WVM6UUnHPlCLz2BcfU0KVijEGMEc65VCoxLGxd14+4tQsenwU8IcYYtG2LGCOOxyOccwghoOs6EBHatkVd12kd/VZImmMt4BarZtHP2NX6iRgjuq5D13Ww1sIYAyKCMSbVwiwcb4yQ8P+01t+aKnOPzaoCExG899Baw9qnXopOhBAQQoBSClrr1Ndny5SxmvvcchyapkkLNiw0f55jg8Gio8zlAj/gFuJvjjHmarLF8blpmvS3GCO89ylO73a7b9udpDufy+4WFTi/SaVUKis4PvHM3xrXYqvsXV9byJAhLDeGqeFt0ZH9aXa/AnVdw1oL731y4+yyd7sdjDHw3l9YLLvoPDnjTY9jWTQGbympmoKMzzwGHKe99yCi5L2k1bIrz+MwHzuGRV308XgEALy/vy95mWKR4Yc/s1icWbMbt9ZeiM05DCdqU0LZqjH4lZAuWWudMmcWSu4vBy53ykhB78lTFnXRHDPyPb/S5WwRrpEBpJUmIoJzLgkuxZfi5qWR7N1PqUIWHWEZM7i1571f8pJFIBMifn5ZHzvnvrllTkY5uZKwqFOTrFW6DXnc2arlMlIQbmjI3afSNctjfrLOe8ZstZHmGngrHaxbcKdO7tCUbUvp1Zi8RpblUx7axvC7o2Mh2Hq51AH+vZwn25gyyZIxWZ4nf9lvDE8jMNeGRJSa+6XDFpxbLoCLRsY1N8xNknvKpKIF5gE6HA7w3qOqqmQVvO9py00ULqWmigsUvh7Mbo7jWFVVaJomdYL6vi9q/9PcyKXHqRRtwTL+5PEqhIDj8QhjzMt2yoawSko7eSXkh96rUgrW2mK2xZTMKhb8DIsOc9xjic+5aqPjUQx9h6hEge5lta7DlEFec8DnuEaJE+Pp2kpT3ugb+3rnllhN4Cnv0Mo9XY8c/Gd23UXXwTFG9H2f9hsD/3q1crvL0HMVXBEuRtF1MAt8Pp/R93364bO2bbHf71FV1aZ/aWAOio7B/GomryUzxpjRv5+xZWFv/rjLPRb8qlZRGrd0KNqCfxnGLQP7A4SPhsCEwRwMAAAAAElFTkSuQmCC';
    const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

    const parametersObj = new params.ImageObjectDetectionPredictionParams({
        confidenceThreshold: 0.4,
        maxPredictions: 10,
    });
    const parameters = parametersObj.toValue();

    // const fs = require('fs');
    // const image = fs.readFileSync(filename, 'base64');
    const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
        content: base64Image,
        mimeType: 'image/png'
    });

    const instanceVal = instanceObj.toValue();
    const instances = [instanceVal];
    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);
    return response.predictions;
    // console.log('Predict image object detection response');
    // console.log(`Deployed model id : ${response.deployedModelId}`);
    const predictions = response.predictions;
    if (predictions.length < 0 || predictions[0].structValue.fields['displayNames'].listValue.values.length === 0) {
        console.log('No results');
        return;
    }
    try {
        let answer = {
            displayName: predictions[0].structValue.fields['displayNames'].listValue.values[0].stringValue,
            confidence: predictions[0].structValue.fields['confidences'].listValue.values[0].numberValue
        }

        // console.log(answer);
    } catch (e) {
        console.error(e, JSON.stringify(predictions[0]));
    }

    console.log('Predictions :');
    for (const predictionResultVal of predictions) {
        const predictionResultObj = prediction.ImageObjectDetectionPredictionResult.fromValue(predictionResultVal);
        for (const [i, label] of predictionResultObj.displayNames.entries()) {
            console.log(`\tDisplay name: ${label}`);
            console.log(`\tConfidences: ${predictionResultObj.confidences[i]}`);
            // console.log(`\tIDs: ${predictionResultObj.ids[i]}`);
            // console.log(`\tBounding boxes: ${predictionResultObj.bboxes[i]}\n\n`);
        }
    }
}


async function getImageBarcodes(endpointId = '7083238624086458368', base64Image) {
    base64Image = base64Image.replace('data:image/jpeg;base64,', '');
    const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

    const parametersObj = new params.ImageObjectDetectionPredictionParams({
        confidenceThreshold: 0.6,
        maxPredictions: 12,
    });

    const parameters = parametersObj.toValue();

    // const fs = require('fs');
    // const image = fs.readFileSync(filename, 'base64');
    const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
        content: base64Image,
        mimeType: 'image/png'
    });

    const instanceVal = instanceObj.toValue();
    const instances = [instanceVal];
    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);

    // console.log('Predict image object detection response');
    // console.log(`Deployed model id : ${response.deployedModelId}`);
    const predictions = response.predictions;
    if (predictions.length < 0 || predictions[0].structValue.fields['displayNames'].listValue.values.length === 0) {
        console.log('No results');
        return;
    }
    try {
        let fields = predictions[0].structValue.fields;

        let answer = fields.confidences.listValue.values.map((i) => ({confidence: i.numberValue}))
        let names = fields.displayNames.listValue.values.map(i => i.stringValue);
        let bboxes = fields.bboxes.listValue.values.map(i => i.listValue.values.map(v => v.numberValue));

        for (let i = 0; i < answer.length; ++i) {
            answer[i]['name'] = names[i];
            answer[i]['bbox'] = bboxes[i];
            answer[i]['barcode'] = utils.barcodeFromLabel(names[i]);
        }

        let barcodes = names.map(n => utils.barcodeFromLabel(n));
        return barcodes;

        return answer;

    } catch (e) {
        console.error(e, JSON.stringify(predictions[0]));
    }
}

async function getImageProducts(endpointId = '7083238624086458368', base64Image) {
    base64Image = base64Image.replace('data:image/jpeg;base64,', '');
    const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

    const parametersObj = new params.ImageObjectDetectionPredictionParams({
        confidenceThreshold: 0.6,
        maxPredictions: 12,
    });

    const parameters = parametersObj.toValue();

    // const fs = require('fs');
    // const image = fs.readFileSync(filename, 'base64');
    const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
        content: base64Image,
        mimeType: 'image/png'
    });

    const instanceVal = instanceObj.toValue();
    const instances = [instanceVal];
    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);

    // console.log('Predict image object detection response');
    // console.log(`Deployed model id : ${response.deployedModelId}`);
    const predictions = response.predictions;
    if (predictions.length < 0 || predictions[0].structValue.fields['displayNames'].listValue.values.length === 0) {
        console.log('No results');
        return [];
    }
    try {
        let fields = predictions[0].structValue.fields;

        let answer = fields.confidences.listValue.values.map((i) => ({confidence: i.numberValue}))
        let names = fields.displayNames.listValue.values.map(i => i.stringValue);
        let bboxes = fields.bboxes.listValue.values.map(i => i.listValue.values.map(v => v.numberValue));

        for (let i = 0; i < answer.length; ++i) {
            answer[i]['name'] = names[i];
            answer[i]['bbox'] = bboxes[i];
            answer[i]['barcode'] = utils.barcodeFromLabel(names[i]);
        }

        let barcodes = names.map(n => utils.barcodeFromLabel(n));
        // return barcodes;

        return answer;

    } catch (e) {
        console.error(e, JSON.stringify(predictions[0]));
    }
}

async function shapeDetection(base64Image) {
    let endpointId = '6090771050344218624';
    // let imageFile = fs.readFileSync('./tests/1.jpeg');
    // let image = await Jimp.read(imageFile);
    // base64Image = await image.getBase64Async(image.getMIME());

    // base64Image = base64Image.split(',')[1];
    const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

    const parametersObj = new params.ImageObjectDetectionPredictionParams({
        confidenceThreshold: 0.3,
        maxPredictions: 25,
    });

    const parameters = parametersObj.toValue();

    // const fs = require('fs');
    // const image = fs.readFileSync(filename, 'base64');
    const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
        content: base64Image,
        mimeType: 'image/png'
    });

    const instanceVal = instanceObj.toValue();
    const instances = [instanceVal];
    const request = {
        endpoint,
        instances,
        parameters,
    };

    const [response] = await predictionServiceClient.predict(request);

    const predictions = response.predictions;
    if (predictions.length < 0 || predictions[0].structValue.fields['displayNames'].listValue.values.length === 0) {
        console.log('No results');
        return;
    }
    try {
        let fields = predictions[0].structValue.fields;

        let answer = fields.confidences.listValue.values.map((i) => ({confidence: i.numberValue}))
        let names = fields.displayNames.listValue.values.map(i => i.stringValue);
        let bboxes = fields.bboxes.listValue.values.map(i => i.listValue.values.map(v => v.numberValue));

        for (let i = 0; i < answer.length; ++i) {
            answer[i]['name'] = names[i];
            answer[i]['boundingbox'] = bboxes[i];
        }

        return answer;

    } catch (e) {
        console.error(e, JSON.stringify(predictions[0]));
    }
}

module.exports.predictImageClassification = predictImageClassification;
module.exports.getImageBarcodes = getImageBarcodes;
module.exports.getImageProducts = getImageProducts;
module.exports.shapeDetection = shapeDetection;

// const tf = require('@tensorflow/tfjs-node');

module.exports.test = function () {
    // let model = tf.sequential();
    // console.log(model);
}
