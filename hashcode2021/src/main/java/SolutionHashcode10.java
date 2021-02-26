import java.io.*;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;


public class SolutionHashcode10 {

    class Car {
        public Car(int id,Queue<Street> path,int days,int distanceLeft){
            this.id=id;
            this.path=path;
            this.days=days;
            this.distanceLeft= distanceLeft;

        }
        int id;
        Queue<Street> path;
        int days;
        int distanceLeft;
        int initDistanceLeft;

    }
    static String inputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of input files
    static String outputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of output files
//System.out.println (filePath);



  //  record PizScore(PriorityQueue<SolutionHashcode10.Pizza> list, int ingredients){};


    public static void main(String[] args) {
        String[] inputs = new String[] {"resources/inputs/a.txt",
                "resources/inputs/b.txt",
                "resources/inputs/c.txt",
                "resources/inputs/d.txt",
                "resources/inputs/e.txt"};
//        for (int i = 0; i < inputs.length; ++i) {
//            pizzaDeliverer(inputs[i]);
//            break;
//        }

        //  pizzaDeliverer(args[1]);
        var result = new SolutionHashcode10();
        result.pizzaDeliverer("a");

        //  result.permutations(List.of("A","B","C","D","E","F","G","H","I","J","K","L","M","N"));
    }
    record Street(int id,String name,int start,int end,int time,Queue<Car> cars){}


    record Intersection(int id,List<Street> streets,List<String> path){}

    record Sched(String street,int seconds){}

   // Queue<Car> schedule = new LinkedBlockingQueue<>();

    Integer marks =0;

    private void pizzaDeliverer(String fileName){
        // Read the input file by name
        // BufferedReader fr = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".in"));
        try (BufferedReader br = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".txt"))) {
            // read the first line from input file
            String[] firstLine = br.readLine().split(" ");

            int time = Integer.parseInt(firstLine[0]);
            int intersection = Integer.parseInt(firstLine[1]);
            int street = Integer.parseInt(firstLine[2]);
            int car = Integer.parseInt(firstLine[3]);
            int bonus = Integer.parseInt(firstLine[4]);

            Intersection[] intersections = new Intersection[intersection];
            for(int x=0;x<intersection;x++){
                intersections[x] = new Intersection(x,new ArrayList(),new ArrayList());

            }

            HashMap<String,Street> streets = new HashMap<>(street);
           // Street[] streets = new Street[street];
            for(int x=0;x<street;x++){
                String[] line = br.readLine().split(" ");
                var s = new Street(x,line[2]
                        ,Integer.parseInt(line[0])
                        ,Integer.parseInt(line[1])
                        ,Integer.parseInt(line[3]),
                        new LinkedBlockingQueue());
                streets.put(s.name,s);

                intersections[s.end].streets.add(s);
            }
          //  List<Street> list =new ArrayList(Arrays.asList(streets));
            Car[] cars = new Car[car];

            for(int x=0;x<car;x++){
                String[] line = br.readLine().split(" ");
                int path = Integer.parseInt(line[0]);
                Queue<Street> s = new LinkedBlockingQueue<>();
                var c  = new Car(x,s,0,0);
                for(int y=1;y<=path;y++){
                    Street st = streets.get( line[y]);
                        //, the car listed rst in the input le goes first
                    s.add(st);
                            if(y==1){
                                st.cars().add(c);
                            }else{
                                c.distanceLeft+=st.time();
                                c.initDistanceLeft+=c.distanceLeft;
                            }
                }
                cars[x]= c;

            }
            List<Car> listCars =new ArrayList(Arrays.asList(cars));
            Collections.sort(listCars, (Comparator.<Car>
                    comparingInt(c -> c.path.size()).reversed()
                    // .thenComparingInt(character2 -> character2.getIngredients().size()))

            ));


            int forwardtime =0;
            while(time >0){
                System.out.printf("time  %s rem %s \n",forwardtime,time);

                int finalForwardtime = forwardtime;
                Queue<Car> process = new LinkedList();
                int finalTime1 = time;
                Arrays.stream(intersections).forEach(intersection1 -> {

                    List<Street> list = new ArrayList<>(intersection1.streets());
                    list.sort(
                        (Comparator.<Street>
                                comparingInt(s ->{
                            AtomicInteger delay= new AtomicInteger();
                            AtomicInteger m= new AtomicInteger();
                            s.cars().forEach(car1 -> {
                                int timeSaved = finalTime1 - (car1.distanceLeft+delay.get());
                                if(timeSaved>0) {//can finish
                                    m.getAndAdd( 1000 + timeSaved);
                                }
                                delay.getAndAdd(1);
                            });
                            System.out.printf("path  %s bestmarks  %s \n",s.name(),m.get());
                            return m.get();

                        } ).reversed()
                        ));//new ArrayList(streets.values());


                list = list.stream().filter(street1 -> {return street1.cars().size()>0;}).collect(Collectors.toList());
                if(list.size()>0) {
                    Street s = list.get(0);

                    Car c= s.cars().peek();
                    if(c.days <=0){
                        System.out.printf("time  %s process later id: %s %s\n",finalForwardtime,c.id,s.name());
                        c= s.cars().poll();
                        process.add(c);
                    }


                    //stopped streets just deduct time or wait red
                    list.stream()
                            //.filter(street1 -> {return street1!=s;})
                            .forEach(street1 -> {
                                street1.cars().stream()
                                           // .filter(car1 -> { return car1.days >=0;})
                                        .forEach(car1 -> {
//                                            if(car1.days >0){
                                                System.out.printf("car %s move remaining %s/%s on %s\n",car1.id, --car1.days,street1.time,street1.name());
//                                            }else{//move
//                                                System.out.printf("time %s wait cars ahead car %s days %s queue: %s on %s \n"
//                                                        ,finalForwardtime,car1.id, car1.days,street1.cars().size(),street1.name());
//
 //                                          }
                                        });

                            });

                }

                });

                //moving time
                while(!process.isEmpty()){
                    Car c = process.poll();
                    int finalTime = time-(c.days+1);

                    Street st = c.path.poll();
                    Street stnext = c.path.peek();//dont separate

                        c.days = stnext.time;
                        c.distanceLeft -= stnext.time();

                    intersections[st.end].path().add(st.name());

                   // if(stnext !=null) {
                    stnext.cars().add(c);
                    String ids= stnext.cars().stream()
                            .map(car1 -> { return "-" + car1.id; })
                            .reduce("", (s1, s2) -> s1 + s2);

                        System.out.printf("time %s Car %s useddays: %s cross %s to %s - wait: %s cars: %s size: %s \n", finalForwardtime,
                                c.id,c.days, stnext.start, stnext.name(),stnext.time,ids,stnext.cars().size());


                    if(c.path.size()==1){ //at end
                        System.out.printf("time %s pop out car %s dist: %s/%s \n",finalForwardtime,c.id,c.distanceLeft,c.initDistanceLeft);
                        int mark = time-(c.distanceLeft);//+ st.cars().size()-1);
                        if(mark>=0){
                            mark +=  1000;
                        }else{
                            mark=0;
                        }
                        marks +=mark;
                        System.out.printf("car %s marks %s total %s\n",c.id, mark,marks);

                    }
                }

                forwardtime++;
                time--;
            }

           // list = list.stream().filter(street1 -> {return street1.cars().size()>0;}).collect(Collectors.toList());


            List<Intersection> out =new ArrayList(Arrays.asList(intersections));
            List<Intersection> outlist  = out.stream().filter(i -> {
                return i.path().size()>0;
            }).collect(Collectors.toList());


            // Print output data and create output file
            try (PrintWriter output = new PrintWriter(outputFilesDirectory + fileName + ".out", "UTF-8")) {
                output.println(outlist.size());
                System.out.println(outlist.size());
                String outs="";

                for (Intersection i : outlist) {
                    String st = "";
                    outs = "";
                    int items =0;
                    int groups =0;
                    st = i.path().get(0);
                    for(int j=0;j<i.path().size();j++){

                        String pp =i.path().get(j);
                        if(st.equalsIgnoreCase(pp)){
                            items++;
                        }else{
                            groups ++;
                            outs+=pp + " " + items + "\n";
                            st = pp;
                            items=0;
                        }
                    }
                    outs=i.id() +"\n"+ ++groups +"\n" + st + " " + items + "\n"+ outs;
                    System.out.print(outs);
                    output.print(outs);
                    System.out.println("total "+ marks);

                }
            }

            System.out.println("");



        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
