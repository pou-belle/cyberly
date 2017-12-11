public class FileFingerprint {
    String filename;
    String md5Fingerprint;
    String parentName;
    
    public FileFingerprint(String filename, String md5Fingerprint, String parentName) {
        this.filename = filename;
        this.md5Fingerprint = md5Fingerprint;
        this.parentName = parentName;
    }
    
    public String getFilename() {
        return filename;
    }
    
    public String getMd5Fingerprint() {
        return md5Fingerprint;
    }

    public String getParentName() {
        return parentName;
    }
}