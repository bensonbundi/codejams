public class Main {

    public static void main(String[] args) {

        markdownParser("# header");
    }
        final static char HEADER ='#';

        public static String markdownParser( String markdown ) {
            String data = "";


            char[] c =markdown.trim().toCharArray();
            int headerType =0;
            char prev =c[0];
            boolean headerDone=false;
            for(int x=0;x<c.length;x++){
                if(!headerDone && c[x]==HEADER){
                    headerType++;
                  //  System.out.println(headerType);
                    continue;
                }
                if(headerType>0 && !headerDone  && Character.isWhitespace(c[x])){  //header complete collect the rest
                    headerDone = true;
                    System.out.println(headerType);
                    continue;
                }
                    if(headerDone){ //collect data
                        data += c[x];
                    }else{
                        return markdown; //problem with input - return as is
                    }


            }
            //construct html tag
            if(headerType<1 &&headerType >6){ //problem with input - return as is
                return markdown;
            }
            String header ="";
            switch(headerType){
                case 1: header ="H1"; break;
                case 2: header ="H2";break;
                case 3: header ="H3";break;
                case 4: header ="H4";break;
                case 5: header ="H5";break;
                case 6: header ="H6";break;
                default: throw new IllegalStateException("Unexpected value Header : " + headerType);
            }

            return String.format("<%s> %s </%s?",header,data.replaceAll("\\s+$", ""),header);

        }

}
