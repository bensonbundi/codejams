import java.io.*;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


public class SolutionHashcode14 {

    class Car {
        public Street current;

        public Car(int id, Queue<Street> path, int days, int distanceLeft){
            this.id=id;
            this.path=path;
            this.earliestReleaseDay=days;
            this.distanceLeft= distanceLeft;

        }
        int id;
        Queue<Street> path;
        int earliestReleaseDay;
        int distanceLeft;
        int initDistanceLeft;

    }
    static String inputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of input files
    static String outputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of output files
//System.out.println (filePath);
static  List<String> allOutput = new ArrayList<>();


  //  record PizScore(PriorityQueue<SolutionHashcode10.Pizza> list, int ingredients){};


    public static void main(String[] args) throws InterruptedException {
        String[] inputs = new String[]{
                "e"// "resources/inputs/a",
                 //"b","c","e","f"
//
// ,"c"
//                ,"d"
//                ,"e"
//                , "f"
        };

        Thread[]threads = new Thread[inputs.length];
        // start all threads
        for (int i = 0; i < inputs.length; ++i) {

            int finalI = i;
            threads[i] =new Thread(() -> {
                var result = new SolutionHashcode14();
                result.pizzaDeliverer(inputs[finalI]);
            });

            threads[i].start();
        }
        for(int i=0; i<threads.length; i++) {
            threads[i].join(); // TODO Exception handling
        }

        allOutput.forEach(s -> System.out.println(s));
        //  pizzaDeliverer(args[1]);
//        var result = new SolutionHashcode10();
//        result.pizzaDeliverer("d");

        //  result.permutations(List.of("A","B","C","D","E","F","G","H","I","J","K","L","M","N"));
    }
    record Street(int id,String name,int start,int end,int time,Queue<Car> cars){}


    record Intersection(int id,List<Street> streets,Map<String,Integer> lights){}

    record Sched(String street,int seconds){}

   // Queue<Car> schedule = new LinkedBlockingQueue<>();

    Integer marks =0;

    private void pizzaDeliverer(String fileName){
        Instant startTime = Instant.now();

        // Read the input file by name
        // BufferedReader fr = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".in"));
        try (BufferedReader br = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".txt"))) {
            // read the first line from input file
            String[] firstLine = br.readLine().split(" ");

            int time = Integer.parseInt(firstLine[0]);
            int totalTime=time;
            int intersection = Integer.parseInt(firstLine[1]);
            int street = Integer.parseInt(firstLine[2]);
            int car = Integer.parseInt(firstLine[3]);
            int bonus = Integer.parseInt(firstLine[4]);
            List<Car> arrivedCars = new ArrayList<>();

            Intersection[] intersections = new Intersection[intersection];
            for(int x=0;x<intersection;x++){
                intersections[x] = new Intersection(x,new ArrayList(),new HashMap<>());

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
                    c.earliestReleaseDay=0;
                            if(y==1){
                                c.current =st;

                                st.cars().add(c);

                            }else{
                                s.add(st);
                                c.distanceLeft+=st.time();
                                c.initDistanceLeft=c.distanceLeft;

                            }
                }
                cars[x]= c;

            }
//            List<Car> listCars =new ArrayList(Arrays.asList(cars));
//            Collections.sort(listCars, (Comparator.<Car>
//                    comparingInt(c -> c.path.size()).reversed()
//                    // .thenComparingInt(character2 -> character2.getIngredients().size()))
//
//            ));


            int forwardtime =0;
            while(time >0){
                System.out.printf("%s time  %s/%s rem %s \n",fileName,forwardtime,totalTime,time);

                int finalForwardtime = forwardtime;
                Queue<Car> process = new LinkedList();
                int finalTime1 = time;
                AtomicInteger earliestJump = new AtomicInteger(totalTime);
                List<Intersection> l =
                Arrays.stream(intersections)
                        .filter(intersection1 -> {
                            return intersection1.streets().stream()
                                    .filter(street1 -> {
                                       Car carx = street1.cars().peek();

                                       if(carx!=null)
                                       if(carx.earliestReleaseDay<earliestJump.get()) {
                                           earliestJump.set(carx.earliestReleaseDay);
                                       }

                                        return carx!=null?(carx.earliestReleaseDay<=finalForwardtime):false;
                                    })
                                    .count() > 0;
                        }).collect(Collectors.toList());

                System.out.printf("%s time  %s/%s filtered intersections %s/%s \n"
                        ,fileName,forwardtime,totalTime,time,l.size(),intersection);
                if(l.size()==0){
                    System.out.printf("%s time wasted second no cars ready anywhere \n"
                            ,fileName,forwardtime,totalTime,time);
                }

                l.forEach(intersection1 -> {

                    List<Street> list = new ArrayList<>(intersection1.streets());
                   list = list.stream().filter(street1 -> {

                       return street1.cars().size()>0;})
                           .collect(Collectors.toList());
                    list.sort(
                            Comparator.comparing(o -> true)


                                    .thenComparing(street1 -> ((Street) street1).cars().size()).reversed()//street with jam

                                    .thenComparing(street1 -> ((Street) street1).cars().peek().distanceLeft).reversed()
                                    //shortest distance
                                    //            (o1, o2) -> { return o1.cars.peek().earliestReleaseDay-o2.cars.peek().earliestReleaseDay; }
                                    .thenComparing(street1 ->{
                                        Integer days = ((Street) street1).cars().peek().earliestReleaseDay - finalForwardtime;
                                        days = days<0?0:days;
                                        return days;

                                    })//waited longest
                                    .thenComparing(street1 -> ((Street) street1).cars().peek().path.peek().cars.size())//next road less traffic


                    );

                    Street s = list.get(0);
                    System.out.printf("%s time %s/%s intersection  %s road %s cars %s\n",fileName,finalForwardtime,totalTime,intersection1.id,s.name(),s.cars().size());

                    Car c= s.cars().peek();

                    if(c.earliestReleaseDay<=finalForwardtime){
                        System.out.printf("%s time %s/%s process later id: %s %s\n",fileName,finalForwardtime,totalTime,c.id,s.name());
                        c= s.cars().poll();
                        process.add(c);
                    }else{
                        System.out.printf("%s time %s/%s no car ready closest dist: %s/%s id: %s %s\n",fileName,finalForwardtime,totalTime,c.earliestReleaseDay,s.time,c.id,s.name());

                    }



                });

                //moving time
                while(!process.isEmpty()){
                    Car c = process.poll();

                    Street st = c.path.poll();

                  //  Street stnext = c.path.peek();//dont separate
                  //  if(stnext !=null) {

                        Integer count =  intersections[c.current.end].lights().getOrDefault(c.current.name(),0);
                        intersections[c.current.end].lights().put(c.current.name(),++count);

                        c.earliestReleaseDay = forwardtime+ st.time;
                        c.distanceLeft = st.time+ c.path.stream().map(s1 -> s1.time()).reduce(0,(i1, i2) -> i1+i2);
                        c.current = st;
                        st.cars().add(c);
//                        String ids = st.cars().stream()
//                                .map(car1 -> {
//                                    return "-" + car1.id;
//                                })
//                                .reduce("", (s1, s2) -> s1 + s2);

                        System.out.printf("time %s/%s Car %s earliestReleaseDay: %s cross %s to %s - waittime: %s  carscount: %s \n"
                                , finalForwardtime,totalTime,
                                c.id, c.earliestReleaseDay, st.start, st.name(), st.time,  st.cars().size());
             //       }

                    if(c.path.size()==0){ //at end
                        System.out.printf("time %s/%s pop out car %s dist: %s/%s \n"
                                ,finalForwardtime,totalTime,c.id,c.distanceLeft,c.initDistanceLeft);
                        int mark = time-(c.distanceLeft);//+ st.cars().size()-1);
                        if(mark>=0){
                            mark +=  bonus;
                        }else{
                            mark=0;
                        }
                        marks +=mark;
                        System.out.printf("time %s/%s car %s marks %s total %s\n"
                                ,finalForwardtime,totalTime,c.id, mark,marks);
                        arrivedCars.add(c);
                        st.cars().remove(c);
                    }
                }
                int futuretime= totalTime-earliestJump.get();
                if(time-1>futuretime){


                    System.out.printf("time %s/%s time jump to %s from %s total %s\n"
                            ,finalForwardtime,totalTime, earliestJump.get(),futuretime,marks);

                 //   time = futuretime;
                  //  continue;
                }

                forwardtime++;
                time--;
            }

           // list = list.stream().filter(street1 -> {return street1.cars().size()>0;}).collect(Collectors.toList());

            List<Intersection> outlist  = Arrays.asList(intersections).stream().filter(i -> {
                return i.lights().size()>0;
            }).collect(Collectors.toList());


            // Print output data and create output file
            try (PrintWriter output = new PrintWriter(outputFilesDirectory + fileName + ".out", "UTF-8")) {
                output.println(outlist.size());
                System.out.println(outlist.size());

                for (Intersection i : outlist) {

                    int items =0;
                    int groups = i.lights().keySet().size()-1;
                    final String[] out = {i.id() + "\n" + ++groups + "\n"};
                  i.lights().forEach((s, count) -> {
                      out[0] += s +" "+ count + "\n";
                  });
                    System.out.print(out[0]);
                    output.print(out[0]);
                }
            }


            String o = String.format(fileName +" cars arrived: %s/%s intersections %s/%s total %s ",arrivedCars.size(),cars.length
                    ,outlist.size(),intersections.length,marks);
            System.out.println(o);
            allOutput.add(o);

            Instant end = Instant.now();
            Duration interval = Duration.between(startTime, end);
            System.out.println(fileName +" Execution time in seconds: " + interval.getSeconds());
            allOutput.add(fileName +" Execution time in seconds: " + interval.getSeconds());


        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
