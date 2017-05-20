public class FileFingerprint {
    String filename;
    String md5Fingerprint;
    
    public FileFingerprint(String filename, String md5Fingerprint) {
        this.filename = filename;
        this.md5Fingerprint = md5Fingerprint;
    }
    
    public String getFilename() {
        return filename;
    }
    
    public String getMd5Fingerprint() {
        return md5Fingerprint;
    }
}