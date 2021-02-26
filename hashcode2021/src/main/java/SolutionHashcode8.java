import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toSet;


public class SolutionHashcode8 {
    class Pizza implements Comparable{
        private Set<String> ingredients = new HashSet<>();

        public void setIngredients(Set<String> ingredients) {
            this.ingredients = ingredients;
        }


        public void setUsedIngredient(int uniqueIngredients) {
            this.usedIngredients = uniqueIngredients;
        }
        public int getUsedIngredients() {
            return usedIngredients;
        }

        private int usedIngredients =0;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        private int id;

        public Set<String> getIngredients() {
            return ingredients;
        }

        public void addIngredient(String ingredient) {
            this.ingredients.add(ingredient);
        }

        @Override
        public int compareTo(Object o) {
            Pizza p = (Pizza) o;

            return this.id-p.id;
        }
    }
    static String inputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of input files
    static String outputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of output files
//System.out.println (filePath);



    record PizScore(PriorityQueue<SolutionHashcode8.Pizza> list, int ingredients){};


    public static void main(String[] args) {
        String[] inputs = new String[] {"resources/inputs/a_example.in",
                "resources/inputs/b_little_bit_of_everything.in",
                "resources/inputs/c_many_ingredients.in",
                "resources/inputs/d_many_pizzas.in",
                "resources/inputs/e_many_teams.in"};
//        for (int i = 0; i < inputs.length; ++i) {
//            pizzaDeliverer(inputs[i]);
//            break;
//        }

        //  pizzaDeliverer(args[1]);
        var result = new SolutionHashcode8();
        result.pizzaDeliverer("e_many_teams");

        //  result.permutations(List.of("A","B","C","D","E","F","G","H","I","J","K","L","M","N"));
    }

    private void pizzaDeliverer(String fileName){
        // Read the input file by name
        // BufferedReader fr = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".in"));
        try (BufferedReader br = new BufferedReader(new FileReader(inputFilesDirectory + fileName + ".in"))) {
            // read the first line from input file
            String[] firstLine = br.readLine().split(" ");

            int numOfPizza = Integer.parseInt(firstLine[0]);
            Pizza[] pizzas = new Pizza[numOfPizza];
            Arrays.setAll(pizzas,value ->  new Pizza()); // Arrays.fill(pizzas, new Pizza());

            int[] teamsCount = new int[]{
                    Integer.parseInt(firstLine[1]), // the num of team of 2
                    Integer.parseInt(firstLine[2]), // the num of team of 3
                    Integer.parseInt(firstLine[3])  // the num of team of 4
            };

            // save the ingredients of pizzas
            for (int i = 0; i < numOfPizza; ++i) {
                String[] pizzaLine = br.readLine().split(" ");
                for (int j = 0; j < Integer.parseInt(pizzaLine[0]); ++j) {
                    pizzas[i].addIngredient(pizzaLine[j+1]);
                    pizzas[i].setId(i);
                }
            }

            //most marks r from most unused ingredients
            //sort by ingredient size/marks

            //Compare by first name and then last name
            List<Pizza> list =new ArrayList(Arrays.asList(pizzas));
            Collections.sort(list, (Comparator.<Pizza>
                    comparingInt(character1 -> character1.getIngredients().size()).reversed()
                    // .thenComparingInt(character2 -> character2.getIngredients().size()))

            ));
            Map<Set, Set<Pizza>> pizzaPerType = list.stream()
                    .collect(groupingBy(Pizza::getIngredients, toSet()));

//            List<Pizza> list = Arrays.stream(pizzas).sorted((o1, o2) -> {
//                int diff = o2.getIngredients().size()-o1.getIngredients().size();
//                if(diff==0){
//
//                }
//                return diff;
//            }). collect(Collectors.toList());




            //divide pizza and count marks

            // used.clear();
            long pizzasLeft = list.size();
            long total =0;
            List<String> out = new ArrayList<>();
            long[] groupLeft = {teamsCount[0],teamsCount[1],teamsCount[2]};

            while(pizzasLeft>0) {

                PizScore li2= new PizScore(new PriorityQueue<>(),0);
                PizScore li3= new PizScore(new PriorityQueue<>(),0);
                PizScore li4= new PizScore(new PriorityQueue<>(),0);
                if (groupLeft[0]>0)
                    li2 = best(pizzaPerType, list,2);
                if (groupLeft[1]>0)
                    li3 = best( pizzaPerType,list,3);
                if (groupLeft[2]>0)
                    li4 = best(pizzaPerType, list,4);

                PizScore li = li2;

                int li2v =li2.list().parallelStream().mapToInt(value -> value.getIngredients().size()).sum();
                int li3v =li3.list().parallelStream().mapToInt(value -> value.getIngredients().size()).sum();
                int li4v =li4.list().parallelStream().mapToInt(value -> value.getIngredients().size()).sum();

                double li2r =li2v<=0?0: li2.ingredients/(li2v *1.0);
                double li3r =li3v<=0?0: li3.ingredients/(li3v*1.0);
                double li4r =li4v<=0?0: li4.ingredients/(li4v*1.0);


                //higher marks
                if(li2.ingredients>=li3.ingredients ) {
                    li = li2;
                }else if(li3.ingredients>=li4.ingredients) {
                    li = li3;
                }else {
                    li = li4;
                }

                //higher ratio
                if(groupLeft[2]>0 && li4r>=li3r && li4r>=0.6) {
                    li = li4;
                }else if(groupLeft[1]>0 && li3r>=li2r && li3r>=0.6) {
                    li = li3;
                }else if(groupLeft[0]>0  && li2r>=0.6) {
                        li = li2;
                    }else {
                    //whoever not null
//                if(groupLeft[2]>0){ li = li4; }
//                if(groupLeft[1]>0){ li = li3; }
//                if(groupLeft[0]>0){ li = li2; }
                }

//                if(groupLeft[2]>0){
//                    li = li4;
//                }
//                if(groupLeft[1]>0){
//                    li = li3;
//                }
//                if(groupLeft[0]>0){
//                    li = li2;
//                }

                if(li.list().size()<2){
                    break;
                }
                long groupPoints = 0;
                if(pizzasLeft>=li.list().size() && groupLeft[li.list().size()-2]>0){
                    long group = li.list().size();
                    groupLeft[li.list().size()-2] -=1;
                    String team= "";
                    while(!li.list().isEmpty()){
                        Pizza p = li.list().poll();
                        list.remove(p);
                        //  groupPoints +=p.getNewIngredients();
                        pizzasLeft -=1;
                        team +=" "+p.getId();

                    }
                    groupPoints +=li.ingredients();
                    out.add(group +team);
                    System.out.println(group +team +" groupPoints " +groupPoints);
                    total += Math.pow(groupPoints,2);
                    System.out.printf("pizzasLeft %s groupPoints  total %s total: %s \n",pizzasLeft,Math.pow(groupPoints,2),total);

                }else{
                    System.out.println("break out .. cant use all pizza");
                    break;
                }



            }

            // Print output data and create output file
            try (PrintWriter output = new PrintWriter(outputFilesDirectory + fileName + ".out", "UTF-8")) {
                output.println(out.size());

                for (String outputLine : out) {
                    output.println(outputLine );
                    System.out.println(outputLine );
                }
            }
            System.out.println( "groupsleft:"
                    +" %s/%s ".formatted(groupLeft[0],teamsCount[0])
                    +" %s/%s ".formatted(groupLeft[1],teamsCount[1])
                    +" %s/%s ".formatted(groupLeft[2],teamsCount[2])
                    + " pizzaleft: " +pizzasLeft
                    + " fed: " + out.size() + " marks " +total);
            System.out.println("");



        } catch (IOException e) {
            e.printStackTrace();
        }
    }


   // HashMap<String,List<Pizza>> bestScoreMap = new HashMap();
    public PizScore best( Map<Set, Set<Pizza>> pizzaPerType,List<Pizza> l,int size) {

       // PriorityQueue<Pizza> best = new PriorityQueue();
      //  PriorityQueue<Pizza> usedList = new PriorityQueue();
        //1,2 - 1   --o,1

      //  TreeMap<Set, Set<Pizza>> treeMap = new TreeMap();


        AtomicInteger groupPoints = new AtomicInteger();
        HashSet<String> used = new HashSet();
        PriorityQueue<Pizza> b = new PriorityQueue();

        List<Set> keys = new ArrayList(pizzaPerType.keySet());
        for (int x=keys.size()-1;x>=0;x--)
        {
            Set key = keys.get(x);
//.filter(pizza -> { return l.contains(pizza);})
            pizzaPerType.get(key).stream().findFirst().ifPresentOrElse(pizza -> {

                long countNew = key.size();
                long countUsed = 0;
                System.out.printf("groups: %s ingreds/members: %s/%s used/new: %s/%s  pid: %s \n",pizzaPerType.size(),key.size(),pizzaPerType.get(key).size(),countUsed,countNew,pizza.id);
                groupPoints.addAndGet((int) countNew);
                used.addAll(pizza.getIngredients());
                b.add(pizza);

                pizzaPerType.keySet().stream().filter((s) -> !key.contains(s))
                        .sorted((o1, o2) -> {
                            int diff = o2.size()-o1.size();
                            return diff;
                        })
                        .limit(size-1).forEach(set -> {
                    long countNew2 = set.size();//key.parallelStream().filter((s) -> !used.contains(s)).count();
                    long countUsed2 = 0;//key.size()-countNew2;
                   Pizza piz = pizzaPerType.get(set).stream().findFirst().get();

                    System.out.printf("groups: %s pickeditems: %s ingreds/members: %s/%s used/new: %s/%s  pid: %s \n",pizzaPerType.size(),b.size(),set.size(),pizzaPerType.get(set).size(),countUsed2,countNew2,piz.id);
                   // if(countNew2>=countUsed2){
                        //add
                   // if(b.size()<size) {
                        groupPoints.addAndGet((int) countNew2);
                        used.addAll(piz.getIngredients());
                        b.add(piz);
//                    }else{
//                        System.out.printf("Error - too many pid: %s \n",piz.id);
//
//                    }
                        //   usedList.add(pizza);
                   // }
//                    if(b.size()>=size){
//                        return new PizScore(new PriorityQueue(b),groupPoints.get());
//                    }

                });
               // clean up pizzaPerType
                b.forEach(p -> {
                    if( pizzaPerType.get(p.getIngredients())!=null && pizzaPerType.get(p.getIngredients()).size()==1){
                        pizzaPerType.remove(p.getIngredients());
                    }
                });


            },() -> {
                //used up remove from list
                pizzaPerType.remove(key);
            });

            if(b.size()>=size){
                return new PizScore(new PriorityQueue(b),groupPoints.get());
            }
        }

//        //if non picked take nxt available
//        int s = b.size();
//        if(s<size){
//            for(int x=0;x<=l.size()-size-s && b.size()<size;x++) {
//                Pizza pizza = l.get(x);
//                if(used.contains(pizza)) continue;
//
//                long countNew = pizza.getIngredients().parallelStream()
//                        .filter((p) -> !used.contains(p)).count();
//
//                groupPoints.addAndGet((int) countNew);
//                used.addAll(pizza.getIngredients());
//                b.add(pizza);
//               // usedList.add(pizza);
//            }
//
//        }


        System.out.println("best "+ " %s groupby %s ".formatted(l.size(),size)+" "+ groupPoints + " vs " +groupPoints);
        return new PizScore(new PriorityQueue(b),groupPoints.get());

    }

}
