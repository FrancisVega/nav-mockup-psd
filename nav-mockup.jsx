// Photoshop Mockup-Creator
// Francis Vega 2013
//
// Descripción
// Crea una 'presentacion' de htmls+imagen(jpg) clickable
// El orden es alfabético (o el orden que obtenga de getFiles() )
// A partir de una carpeta con .psds (las carpetas hijas se obvian)
//
// Opciones: Desktop y Móvil
// Desktop pone las imágenes como fondo
//
// Móvil pone las imágenes como <a> con el width al 100% para que sea más
// cómodo verla en distintos tamaños de pantalla móvil
//
// LICENCIA: Usa esto como te de la real gana :)
//
// POR HACER:
// Todas las opciones de los checks... :)
//

// Enable double clicking from Finder and Windows Explorer
#target photoshop

// In case we double clicked the file
app.bringToFront();

// JPG Quality
var image_quality = 85

var defaultRulerUnits = preferences.rulerUnits; 
preferences.rulerUnits = Units.PIXELS;

// UI
// Main window
// That's a fucking madness, I know
var w = new Window("dialog", "Web Mockup Creator. Photohop Tools (c) Francis Vega", {x:800, y:300, width:400, height:600});

						w.add("statictext", {x:20,	y:20,	width:360,	height:20}, 'Proyect Name');
var project_name = 		w.add("edittext", 	{x:20,	y:40,	width:360,	height:25}, '');
						w.add("statictext", {x:20,	y:80,	width:360,	height:20}, 'Tag Line (Used in Covers)');
var project_tag =		w.add("edittext", 	{x:20,	y:100,	width:360,	height:25}, '');
						w.add("statictext", {x:20,	y:140,	width:360,	height:20}, 'PSD\'s Path');
var psd_path = 			w.add("edittext", 	{x:20,	y:160,	width:300,	height:25}, '');
var psd_exam = 			w.add("button", 	{x:330,	y:160,	width:60,	height:25}, "browse...");
						w.add("statictext", {x:20,	y:200,	width:360,	height:20}, 'Mockup destination Path');
var jpg_path = 			w.add("edittext", 	{x:20,	y:220,	width:300,	height:25}, '');
var jpg_exam = 			w.add("button", 	{x:330,	y:220,	width:60,	height:25}, "browse...");

						w.add("statictext", {x:20,	y:260,	width:360,	height:20}, 'Logo');
var logo_path = 		w.add("edittext", 	{x:20,	y:280,	width:300,	height:25}, '');
var logo_exam = 		w.add("button", 	{x:330,	y:280,	width:60,	height:25}, "browse...");

						w.add("statictext", {x:20,	y:320,	width:360,	height:20}, 'Logo height (px)');
var logo_height =		w.add("edittext", 	{x:20,	y:340,	width:60,	height:25}, '100');

var zip = 				w.add("statictext", {x:20,	y:380,	width:420,	height:20}, 'Background Color (HEX)');
var back_color =		w.add("edittext", 	{x:20,	y:400,	width:60,	height:25}, 'FFFFFF');

var portrait = 			w.add("checkbox", 	{x:20,	y:440,	width:300,	height:20}, 'Corporate Cover');

var radio_desktop = 	w.add("radiobutton", 	{x:20,	y:470,	width:300,	height:20}, 'Desktop');

var radio_mobile = 		w.add("radiobutton", 	{x:100,	y:470,	width:300,	height:20}, 'Mobile');
/*
var endportrait = 		w.add("checkbox", 	{x:20,	y:400,	width:300,	height:20}, 'Back Cover');
var subpixel = 			w.add("checkbox", 	{x:20,	y:420,	width:300,	height:20}, 'Render Font SubPixel (slow)');
var grid = 				w.add("checkbox", 	{x:20,	y:440,	width:4280,	height:20}, 'Grid Page');
*/
var goButton =			w.add("button",		{x:20,	y:520,	width:360,	height:60}, 'CREATE MOCKUP');


// Focus, focus, focus, @ name field
project_name.active = true

// Portrait and Desktop mode by default
portrait.value = true
radio_desktop.value = true;

goButton.onClick = function() { mockupCreator(); }
psd_exam.onClick = function() { browsePSD(); }
jpg_exam.onClick = function() { browseJPEG(); }
logo_exam.onClick = function() { browseLOGO(); }
 
w.show()


function browseLOGO() {
	logo_path.text = app.openDialog()
}

function browsePSD() {
    var inputFolder = Folder.selectDialog("Select a folder to process");
    psd_path.text = inputFolder.fsName;
}

function browseJPEG() {
    var inputFolder = Folder.selectDialog("Select a folder to process");
    jpg_path.text = inputFolder.fsName;
}

function mockupCreator() {

	var PATH_PSD = psd_path.text;
	var PATH_JPEG = jpg_path.text;

	// Save dialog preferences
	var startDisplayDialogs = app.displayDialogs;

	// No dialogs
	app.displayDialogs = DialogModes.NO;

	// Constants
	var FILE_TYPE = ".psd";
	var SEARCH_MASK = "*" + FILE_TYPE;

	// exception vars
	var X_NOINPUT = "noInput";
	var X_BADDOC = "badDoc";	
	
	// ALL PSD's
	try {
		
		// Input folder
		var inputFolder = Folder(PATH_PSD);
		if (inputFolder == null)
			throw X_NOINPUT;

		// get all psd files in the input folder
		var fileList = inputFolder.getFiles(SEARCH_MASK);

		// Create a folder based on date_projectName
		var d = new Date();
		var fileDate = d.getDate() + "" + d.getMonth() + "" + d.getFullYear() + "_" + project_name.text;
		mockup_folder = new Folder (PATH_JPEG + "\\" + fileDate);		
		mockup_folder.create()	
		mockup_folder_path = mockup_folder.fsName + "\\"
		
		if(portrait.value){
			// PORTRAIT PSD & JPG
			create_portrait(mockup_folder_path, "000_portada", project_name.text, project_tag.text);			
		}		
		
		// Open psds
		for (var i = 0; i < fileList.length; i++) {
			if ((fileList[i] instanceof File) && (fileList[i].hidden == false)) {
			
				var docRef = open(fileList[i]);

				// file name
				file_name = fileList[i].name
				file_name_no_ext = file_name.toString().substring(0, file_name.toString().length-4)
				
				// portada
				if(i==0 && portrait.value){
					createHTML(mockup_folder_path, "000_portada", fileList[0].name.toString().substring(0, fileList[0].name.toString().length-4), true)
				}
				
				if(i<fileList.length-1) {
					file_name_siguiente = fileList[i+1].name
					file_name_no_ext_siguiente = file_name_siguiente.toString().substring(0, file_name_siguiente.toString().length-4)
				} else {
					file_name_siguiente = fileList[0].name
					file_name_no_ext_siguiente = file_name_siguiente.toString().substring(0, file_name_siguiente.toString().length-4)
				}
				
				// img
				saveForWebJPG(mockup_folder_path, file_name_no_ext)
				
				// html
				createHTML(mockup_folder_path, file_name_no_ext, file_name_no_ext_siguiente, false)
				
				if (docRef == null)
					throw X_BADDOC;
					
				// Close the Photoshop file
				docRef.close(SaveOptions.DONOTSAVECHANGES);
			}
		}
	}
	
	catch (exception) {
		alert(exception);
	}
	
	finally {
		// Reset preferences
		app.displayDialogs = startDisplayDialogs;
	}
}

function saveForWebJPG(outputFolderStr, filename) {
    var opts, file;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.JPEG;
    opts.includeProfile = false
    opts.quality = image_quality;	
	file = new File(outputFolderStr + filename + ".jpg");	
    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}

function createHTML (outputFolderStr, filename, html_href, portrait) {
	
	var a = new File(outputFolderStr + "/" + filename + ".html");
	// var height = activeDocument.height.toString().substring(0,(activeDocument.height.toString().length)-3)
	var height = app.activeDocument.height.as('px');

	var bgcolor = "000000"

	if (portrait == true) {
		bgcolor = "FFFFFF"
	} else if (portrait == false) {
		bgcolor = back_color.text
	}

	if (radio_desktop.value == true) {
		var html_file =
		'<!-- File created by MockupCreator Francis Vega -->\
		<!DOCTYPE html>\
		<meta name="viewport" content="width=device-width">\
		<html>\
			<head>\
			<title>' + project_name.text + '</title>\
			<style>\
				* {\
					padding:0;\
					margin:0;\
				}\
				div {\
					height:' + height + 'px;\
					margin:0 auto;\
					background:url("' + filename + ".jpg" + '") #'+ bgcolor +' top center no-repeat;\
				}\
			</style>\
			</head>\
			<body>\
			<a href="' + html_href + ".html" + '"><div></div></a>\
			</body>\
		</html>';
	}

	if (radio_mobile.value == true) {
		var html_file =
		'<!-- File created by MockupCreator Francis Vega -->\
		<!DOCTYPE html>\
		<meta name="viewport" content="width=device-width">\
		<html>\
			<head>\
			<title>' + project_name.text + '</title>\
			<style>\
				* {\
					padding:0;\
					margin:0;\
				}\
				div {\
					height:' + height + 'px;\
					margin:0 auto;\
				}\
				img { width: 100%; }\
			</style>\
			</head>\
			<body>\
			<a href="' + html_href + ".html" + '"><div><img src=\"'+filename+'.jpg\""></div></a>\
			</body>\
		</html>';
	}
	
	a.open('w');
	a.write(html_file);
	a.close();
}



function createHTML_img_base (outputFolderStr, filename, html_href) {
	var a = new File(outputFolderStr + "/" + filename + ".html");
	//var width = activeDocument.width.toString().substring(0,(activeDocument.width.toString().length)-3)
	var width = app.activeDocument.width.as('px');

	var html_file = 
	'<!-- File created by MockupCreator Francis Vega -->\
	<html>\
		<title>' + project_name.text + '</title>\
		<style>\
			* {padding:0; margin:0;}\
			#main{width:' + width + 'px;}\
			.hcenter{margin:0 auto;}\
		</style>\
		</head>\
		<body>\
		<div id="main" class="hcenter">\
		<a href="' + html_href + ".html" + '"><img src="' + filename + ".jpg" + '" /></a>\
		</div>\
		</body>\
	</html>';
	a.open('w');
	a.write(html_file);
	a.close();
}

function create_portrait (path, name, title, tagline) {
	var doc_width = 800;
	var doc_height = 480;
	var doc_title = title;
	var doc_tag_line = tagline;

	newDoc = app.documents.add(doc_width, doc_height, 72, "portada", NewDocumentMode.RGB);

	var doc = activeDocument;

	// title layer
	var title_color = new SolidColor();
		title_color.rgb.red  = 20; 
		title_color.rgb.green =20;
		title_color.rgb.blue = 20;
		
	var newTextLayer = doc.artLayers.add();
		newTextLayer.kind = LayerKind.TEXT;		
	var title_layer = newTextLayer.textItem;
	
	var title_font_size = 60;		
	
	title_layer.font = "TrebuchetMS";
	title_layer.size= title_font_size;
	title_layer.color = title_color;

	title_layer.kind = TextType.PARAGRAPHTEXT; 
	title_layer.width = newDoc.width - 40;
	title_layer.height = title_font_size;
	title_layer.position = Array(20, 220); 

	title_layer.justification=Justification.CENTER;
	title_layer.contents = doc_title
	
	// tagline layer
	var tag_color = new SolidColor();
		tag_color.rgb.red  = 110; 
		tag_color.rgb.green = 110; 
		tag_color.rgb.blue = 110;
		
	var newTextLayer = doc.artLayers.add();
		newTextLayer.kind = LayerKind.TEXT;		
	var tag_layer = newTextLayer.textItem;
	
	var tag_font_size = 40;		
	
	tag_layer.font = "Arial-Bold";
	tag_layer.size= tag_font_size;
	tag_layer.color = tag_color;

	tag_layer.kind = TextType.PARAGRAPHTEXT; 
	tag_layer.width = newDoc.width - 40;
	tag_layer.height = tag_font_size;
	tag_layer.position = Array(20, title_font_size + 220); 

	tag_layer.justification=Justification.CENTER;
	tag_layer.contents = doc_tag_line
	
	// place the logo
	// place_logo (newDoc, logo_path.text);

	// img
	saveForWebJPG(path, name)	

	// close
	newDoc.close(SaveOptions.DONOTSAVECHANGES);
}


// ----------------------------------------------------
// Place an image (logo?) at top of title and tag title
// ----------------------------------------------------
function place_logo (target_document, file) {
    
    // Open in Photoshpo the image
    var newDoc = open(File(file));

    // Grab size
    var width = newDoc.width;
    var height = newDoc.height;
    
    // Resize from 100px of height
    var lock_heiht = parseInt(Number(logo_height.text))
    var w = width * (lock_heiht / height)
    var h = lock_heiht

    // Conpute the resize
    newDoc.resizeImage(w, h);

    // Copy
    newDoc.selection.selectAll();
    newDoc.selection.copy();
 
    // Close
    newDoc.close(SaveOptions.DONOTSAVECHANGES);
 
 	// Set the main document as active   
    activeDocument = target_document

    // Paste image (logo)
    target_document.paste()
    
    // Calculate the new position of image
    // Set top-margin
    var top_margin = lock_heiht-40

    // Get the layer bounds and decompose in vars x1, x2, y1, y2
    bounds = target_document.activeLayer.bounds
    x1 = bounds[0].as("px");
    y1 = bounds[1].as("px");
    x2 = bounds[2].as("px");
    y2 = bounds[3].as("px");    

	// Reset, move layer to (0,0,0,0)
	target_document.activeLayer.translate(x1*-1, y1*-1)
  
 	// Final position of layer
    logoWidth = x2-x1    
    offsetx = (activeDocument.width-logoWidth)/2

    // Finally move the layer
    target_document.activeLayer.translate(offsetx, top_margin)

}


// :)