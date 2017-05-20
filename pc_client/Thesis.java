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

public class Thesis {

	public static void main(String[] args) throws NoSuchAlgorithmException, FileNotFoundException, IOException{
        // urls about the specific dir that we want the algorithm to run to in System32 and in Program Files
        String system32Folder ="/Users/dimitris/Documents/Projects/thesismarkella/new/java";
        String userFolder ="/Users/dimitris/Documents/Projects/thesismarkella/new/legacy";
		
        MessageDigest md = MessageDigest.getInstance("MD5");
        
        List listFilesForFolder = new ArrayList();
       // we create a list of files for system32folder and a list for userfiles for programfiles
        List<File> files  = listFilesForFolder(new File(system32Folder));
        List<File> userfiles = listFilesForFolder(new File(userFolder));
        
       //i get lists for both system32 files and user files 
      List<FileFingerprint> fps = getFingerprintsfromFile(files, md);
        List<FileFingerprint> fps1 = getFingerprintsfromFile(userfiles,md);
        
        
        // print the objects in a pretty way 
        //prettyPrinting(fps);
        // we created a method beacause we want the same algorithm to run in both files.That´s why we made it dynamical.
        sendToServer(fps, "http://localhost:8080/api/fingerprints");
        sendToServer(fps1, "http://localhost:8080/api/system32");
	}
// method to get the fingerprints for both system32 and userfiles and we call it above t
    public static List<FileFingerprint> getFingerprintsfromFile (List<File> files,MessageDigest md) 
        throws FileNotFoundException,NoSuchAlgorithmException,IOException{
        List<FileFingerprint> fps = new ArrayList<FileFingerprint>();
        
        // for every file get its digest and its name and create a new FileFingerprint object
        for(int i = 0; i < files.size(); i++) {
            File file = files.get(i);
            String digest = getDigest(new FileInputStream(file), md, 2048);
            FileFingerprint fp = new FileFingerprint(file.getAbsolutePath(), digest);
            fps.add(fp);
        }
        return fps;
    }
    

    // returns the digest from the files InputStream
	public static String getDigest(InputStream is, MessageDigest md, int byteArraySize)
			throws NoSuchAlgorithmException, IOException {

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
    public static List<File> listFilesForFolder(final File folder) {
        List<File> files = new ArrayList<File>();
        for (final File fileEntry : folder.listFiles()) {
            
            // here we check if we have a directory
            if (fileEntry.isDirectory()) {
                files.addAll(listFilesForFolder(fileEntry));
            } 
            // if it's not a dir, should be a file
            else {
                // however we check once again
                if (fileEntry.isFile()) {
                    String temp = fileEntry.getName();
                    files.add(fileEntry);       
                }
            }
        }
        
        return files;
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
    public static void sendToServer(List<FileFingerprint> fps, String url) throws MalformedURLException, ProtocolException, IOException, UnsupportedEncodingException {
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
                sb.append(line + "\n");  
            }
            br.close();
            System.out.println("" + sb.toString());  
        } else {
            System.out.println(con.getResponseMessage());  
        }  
        
    }
    
    public static String getJsonFormattedString(List<FileFingerprint> fps) {
        String json = new String();
        
        json+= "{";
        json+= "\"uuid\": " + "\"" + getMacAddress() + "\"," ;
        json+= " \"fingerprints\": [";
            
        for(int i = 0; i < fps.size(); i++) {
            FileFingerprint fp = fps.get(i);
            json+= "{ \"filename\":" + "\"" + fp.getFilename() + "\"" + ",";
            json+= "\"md5\":"+ "\"" + fp.getMd5Fingerprint() + "\"" + "},";
        }
        json = json.substring(0, json.length()-1);
        json+= "]";
        json+= "}";
        System.out.println(json);
        
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
