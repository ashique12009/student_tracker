var engineName = EnumEngines.FingerPrint;
/*
* Biometric Capture
*/
function captureBiometric() {
	/* Call to capture biometric */
	if (engineName == EnumEngines.FingerPrint) {
        FingerPrintCapture(
            EnumDevices.Secugen, 
            EnumFeatureMode.Disable, 
            EnumTemplateFormat.ISO, 
            EnumCaptureType.SingleCapture, 
            EnumCaptureMode.TemplateOnly, 
            EnumBiometricImageFormat.WSQ,
            EnumSingleCaptureMode.LeftFingerCapture, 
            180.0, 
            EnumCaptureOperationName.ENROLL, 
            CaptureResult);
	}    
	else if (engineName == EnumEngines.FingerVein) // for Fingervein
		FingerVeinCapture(deviceName, quickScan, captureType, 180.0, EnumCaptureOperationName.ENROLL, CaptureResult);
	else if (engineName == EnumEngines.Iris) // for iris
		IrisCapture(deviceName, quickScan, 180.0, EnumFeatureMode.Disable, CaptureResult);
	else if (engineName == EnumEngines.Face) // for face
		FaceCapture(quickScan, 180.0, EnumFeatureMode.Disable, EnumFaceImageFormat.Jpeg, EnumCaptureOperationName.ENROLL, CaptureResult);
}

function getCookieValue(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/*
* Hnadle capture data
*/
function CaptureResult(captureResponse) {
	document.getElementById('serverResult').style.display = 'block';
	if (captureResponse.CloudScanrStatus != null && captureResponse.CloudScanrStatus.Success) {

		if (captureResponse.TemplateData != null && captureResponse.TemplateData.length > 0) {
            // store this captured TemplateData in a hidden field or variable for Identification call
            templateData = captureResponse.TemplateData;
            document.getElementById('templateXML').value = templateData; 
		}
		else if (engineName == 'IRIS01' && captureResponse.BioImageData != null && captureResponse.BioImageData.length > 0) {
			document.getElementById('templateXML').value = captureResponse.BioImageData;
		}
		else {
			document.getElementById('lblTemplate').style.display = 'none';
		}
		document.getElementById('serverResult').innerHTML = "Capture success. Please click on identify button";
	}
	else if (captureResponse.CloudScanrStatus != null) {
		document.getElementById('serverResult').innerHTML = captureResponse.CloudScanrStatus.Message;
	} else {
		document.getElementById('serverResult').innerHTML = captureResponse;
	}
}