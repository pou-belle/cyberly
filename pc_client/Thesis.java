/** 
 * 
 *
 This is a my thesis about cyber Diversity.It is called Cyber.ly.
 * @author Markella Zacharouli
 */

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.File;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;
import java.lang.StringBuilder;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Enumeration;
import java.awt.Desktop;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.lang.NullPointerException;


public class Thesis {
       static String system32Folder = System.getenv("WINDIR") + "\\system32";
      static  String userFolder = System.getenv("ProgramFiles");
      static  String ProgramFiles86Folder = System.getenv("ProgramFiles(x86)");


    public static void main(String[] args) throws NoSuchAlgorithmException, FileNotFoundException, IOException , URISyntaxException,NullPointerException{
        // urls about the specific dir that we want the algorithm to run to in System32 and in Program Files.Gets windows env in system 32 and Program Files
        
		
        MessageDigest md = MessageDigest.getInstance("MD5");
        
        List listFilesForFolder = new ArrayList();
        // we create a list of files for system32folder and a list for userfiles for programfiles
        List<FileData> files  = listFilesForFolder(new File(system32Folder));
        List<FileData> userfiles = listFilesForFolder(new File(userFolder));
        List<FileData> programfiles86files = listFilesForFolder(new File(ProgramFiles86Folder));

        //i get lists for both system32 files and user files 
        List<FileFingerprint> fpsSystem32 = getFingerprintsfromFile(files, md);
        List<FileFingerprint> fpsUserFiles = getFingerprintsfromFile(userfiles,md);
        List<FileFingerprint> fpsProgramFiles86Files = getFingerprintsfromFile(programfiles86files,md);
        // print the objects in a pretty way 
        //prettyPrinting(fps);
        // we created a method beacause we want the same algorithm to run in both files.That´s why we made it dynamical.

            // String results = sendToServer(fpsUserFiles, "https://cyberly.herokuapp.com/api/fingerprints");



//        sendToServer(fpsSystem32, "http://localhost:8080/api/system32"); // system 32 files

String urlprefix="https://cyberly.herokuapp.com";

  String results= sendAllToServer( fpsSystem32,fpsUserFiles,fpsProgramFiles86Files,urlprefix);

//leads to a page where the results are
        if(Desktop.isDesktopSupported()) {
//            String urlToLaunch = "https://cyberly.herokuapp.com/api/results/"+results;

       String urlToLaunch =  urlprefix +"/api/results/"+results;

            Desktop.getDesktop().browse(new URI(urlToLaunch));

        }
	}



	private static String sendAllToServer( List<FileFingerprint> fpsSystem32, List<FileFingerprint> fpsUserFiles
     , List<FileFingerprint> fpsProgramFiles86Files, String urlprefix) throws MalformedURLException,ProtocolException,IOException{
        sendToServer(fpsSystem32,  urlprefix + "/api/system32" );
        sendToServer(fpsProgramFiles86Files, urlprefix+ "/api/programfiles86"); // program files (x86)
        String results = sendToServer(fpsUserFiles,urlprefix+  "/api/fingerprints"); // program files

        return results ;
    }

// method to get the fingerprints for both system32 and userfiles and we call it above t
    public static List<FileFingerprint> getFingerprintsfromFile (List<FileData> fileDataList,MessageDigest md) 
        throws FileNotFoundException,NoSuchAlgorithmException,IOException,NullPointerException {

        List<FileFingerprint> fps = new ArrayList<FileFingerprint>();
        
        // for every file get its digest and its name and create a new FileFingerprint object
        for(int i = 0; i < fileDataList.size(); i++) {
            FileData fileData = fileDataList.get(i);
            File file = fileData.getFile();
            String parentName = fileData.getParentName();
          
            // if file not found continue with the next one because it's a loop
            if(file.getName().endsWith(".exe")) {

              //  System.out.println(file.getName());
                try {
                    String digest = getDigest(new FileInputStream(file), md, 2048);
                    FileFingerprint fp = new FileFingerprint(file.getName(), digest, parentName);
                    fps.add(fp);
                } catch (FileNotFoundException e){

                }
            
            }

        }
        return fps;
    }
    

    // returns the digest from the files InputStream
	public static String getDigest(InputStream is, MessageDigest md, int byteArraySize)
			throws NoSuchAlgorithmException, IOException,NullPointerException {

		md.reset();
		byte[] bytes = new byte[byteArraySize];
		int numBytes;
		while ((numBytes = is.read(bytes)) != -1) {
			md.update(bytes, 0, numBytes);
		}
		byte[] digest = md.digest();
		String result = bytesToHex(digest);
        is.close();
		return result;
	}
 
    // returns the list of the files of a folder and its subfolders
    public static List<FileData> listFilesForFolder(final File folder) {
        List<FileData> fileDataList = new ArrayList<FileData>();
        
        if(folder.listFiles() != null) {
            for (final File fileEntry : folder.listFiles()) {
                
                // here we check if we have a directory
                if (fileEntry.isDirectory()) {
                    fileDataList.addAll(listFilesForFolder(fileEntry));
               
                    
                } 
                // if it's not a dir, should be a file
                else {
                    // however we check once again
                    if (fileEntry.isFile()) {
                        String temp = fileEntry.getName();


                        // remove the user folder part of the path and keep the rest 
                        // e.g. C://Program Files/viber/bin/viber.exe to viber/bin/viber.exe 
                        String parentFolderName = fileEntry.getPath().replace(userFolder + "\\" ,"");

                        // remove the system32 part of the path and keep the rest 
                        // e.g. C://Windows/System32/CatRoot/something/something.dll to System32/CatRoot/something/something.dll
                        parentFolderName = parentFolderName.replace(system32Folder + "\\" ,""); 

                        // get the first occurence of the \ so we ommit the rest and keep the part of the path of the first folder (the parent one)
                        // that will let us know what application or what part of te System32 the file belongs to 
                        // e.g. viber/bin/viber.exe to viber
                        int indexOfSlash = parentFolderName.indexOf('\\');
                        if(indexOfSlash > 0) {
                            parentFolderName = parentFolderName.substring(0, indexOfSlash);
                        }
                        // System.out.println(parentFolderName + " -- " + temp);

                        FileData fileData = new FileData(fileEntry, parentFolderName);
                        fileDataList.add(fileData); 
                    }
                }
            }
        }
        
        return fileDataList;
    }
    //MD5 algorithm to get the figerprints
    
    // the array with the available hex characters
    final protected static char[] hexArray = "0123456789ABCDEF".toCharArray();
    
    // converts bytes to a hex string
    public static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for ( int j = 0; j < bytes.length; j++ ) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = hexArray[v >>> 4];
            hexChars[j * 2 + 1] = hexArray[v & 0x0F];
        }
        
        return new String(hexChars);
    }
    
    public static void prettyPrinting(List<FileFingerprint> fps) {
        System.out.println("\n\n\n****************** START ******************");
        
        for(int i = 0; i < fps.size(); i++) {
            FileFingerprint fp = fps.get(i);
            System.out.println("File " + fp.getFilename() + "\t" + " has md5 " + fp.getMd5Fingerprint());
        }
        
        System.out.println("****************** END ******************");
    }
    // method to get to both api fingerprint and system32 
    public static String sendToServer(List<FileFingerprint> fps, String url) throws MalformedURLException, ProtocolException, IOException, UnsupportedEncodingException {
        String json = getJsonFormattedString(fps);
        
        // it is dynamic.We added the appropriate url above
        // Post requests
       
        URL object=new URL(url);

        HttpURLConnection con = (HttpURLConnection) object.openConnection();
        con.setDoOutput(true);
        con.setDoInput(true);
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestMethod("POST");

        OutputStreamWriter wr = new OutputStreamWriter(con.getOutputStream());
        wr.write(json);
        wr.flush();

        // the following is optional: display what returns the POST request
        StringBuilder sb = new StringBuilder();  
        int HttpResult = con.getResponseCode(); 
        if (HttpResult == HttpURLConnection.HTTP_OK) {
            BufferedReader br = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "utf-8"));
            String line = null;  
            while ((line = br.readLine()) != null) {  
                sb.append(line);



            }
            br.close();
            System.out.println (sb.toString());
         return sb.toString();
        } else {
         System.out.println ("Server return an error with error code " +HttpResult);
        }
        return null;


    }



    public static String getJsonFormattedString(List<FileFingerprint> fps) {
        String json = new String();
        
        json+= "{";
        json+= "\"uuid\": " + "\"" + getMacAddress() + "\"," ;
        json+= " \"fingerprints\": [";
            
        for(int i = 0; i < fps.size(); i++) {
            FileFingerprint fp = fps.get(i);
            json+= "{ \"filename\":" + "\"" + fp.getFilename() + "\"" + ",";
            json+= "\"parentName\":" + "\"" + fp.getParentName() + "\"" + ",";
            json+= "\"md5\":"+ "\"" + fp.getMd5Fingerprint() + "\"" + "},";



        }


        json = json.substring(0, json.length()-1);
        json+= "]";
        json+= "}";
//        System.out.println(json);


        return json;


    }




     //  method to get the MAC Address and the IP Address.It is used in order to specify the users





    public static String getMacAddress() {    
    InetAddress ip;
	try {

		ip = InetAddress.getLocalHost();
		System.out.println("Current IP address : " + ip.getHostAddress());

		NetworkInterface network = NetworkInterface.getByInetAddress(ip);

		byte[] mac = network.getHardwareAddress();

		System.out.print("Current MAC address : ");

		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < mac.length; i++) {
			sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
		}
		System.out.println(sb.toString());
        return sb.toString();

	} catch (UnknownHostException e) {

		e.printStackTrace();

	} catch (SocketException e){

		e.printStackTrace();

	}
        
        return "Unknown";
    
    }
        
        
}
