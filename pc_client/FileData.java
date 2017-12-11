 import java.io.File;

 public class FileData {
    File file;
    String parentName;

    public FileData(File file, String parentName) {
        this.file = file;
        this.parentName = parentName;
    }

    public File getFile () {
        return file;
    }

    public String getParentName() {
        return parentName;
    }
}