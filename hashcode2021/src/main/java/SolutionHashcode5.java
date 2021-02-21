import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


public class SolutionHashcode5 {
    class Pizza {
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
    }
    static String inputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of input files
    static String outputFilesDirectory = new File("").getAbsolutePath()+"/src/main/resources/"; // Location of output files
//System.out.println (filePath);



record PizScore(List<SolutionHashcode5.Pizza> list, int ingredients){};

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
        var result = new SolutionHashcode5();
        result.pizzaDeliverer("c_many_ingredients");

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

                PizScore li2= new PizScore(new ArrayList<>(),0);
                PizScore li3= new PizScore(new ArrayList<>(),0);
                PizScore li4= new PizScore(new ArrayList<>(),0);
                if (groupLeft[0]>0)
                li2 = best( list,2);
                if (groupLeft[1]>0)
                 li3 = best( list,3);
                if (groupLeft[2]>0)
                 li4 = best( list,4);

                PizScore li = li2;
                if(li2.ingredients>=li3.ingredients ) {
                    li = li2;
                }else if(li3.ingredients>=li4.ingredients) {
                    li = li3;
                }else {
                    li = li4;
                }

//                if(groupLeft[2]>0){
//                    li = li4;
//                }
//                if(groupLeft[1]>0){
//                    li = li3;
//                }
//
//                if(groupLeft[0]>0){
//                    li = li2;
//                }





                if(li.list().size()<2){
                    break;
                }
                long groupPoints = 0;
                    if(pizzasLeft>=li.list().size() && groupLeft[li.list().size()-2]>0){
                        groupLeft[li.list().size()-2] -=1;
                        String team= "";
                        for(int y=0;y<li.list().size();y++){
                           Pizza p = li.list().get(y);
                            list.remove(p);
                          //  groupPoints +=p.getNewIngredients();
                            pizzasLeft -=1;
                            team +=" "+p.getId();

                        }
                        groupPoints +=li.ingredients();
                        out.add(li.list().size() +team);
                        System.out.println(li.list().size() +team +" groupPoints " +groupPoints);
                        total += Math.pow(groupPoints,2);
                        System.out.println(" groupPoints  total " +Math.pow(groupPoints,2));

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
                    +" "+ groupLeft[0] +" "+ groupLeft[1] +" "+ groupLeft[2]
                    + " pizzaleft: " +pizzasLeft
                    + " fed: " + out.size() + " marks " +total);
            System.out.println("");



        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public  void permutations(List<String> s)
    {
        // create an empty ArrayList to store (partial) permutations
        List<List<String>> partial = new ArrayList<>();

        // initialize the list with the first character
        partial.add(List.of(s.get(0)));

        // do for every character of the specified list
        for (int i = 1; i < s.size(); i++)
        {
            // consider previously constructed partial permutation one by one

            // (iterate backwards to avoid ConcurrentModificationException)
            for (int j = partial.size() - 1; j >= 0 ; j--)
            {
                // remove current partial permutation from the ArrayList
                List<String> str = partial.remove(j);

                // Insert next character of the specified string in all
                // possible positions of current partial permutation. Then
                // insert each of these newly constructed string in the list

                for (int k = 0; k <= str.size(); k++)
                {
                   // partial.add(str.substring(0, k) + s.charAt(i) + str.substring(k));
                    List<String> l = new ArrayList<>(str.subList(0, k));
                    l.add(s.get(i));
                    l.addAll(str.subList(k, str.size()));
                     partial.add(l);
                    System.out.println(l);
                }
            }
        }

        System.out.println(s.size() + " " +partial.size());
        System.out.println(partial);
    }


    public PizScore best(List<Pizza> l,int size) {

    int bestScore =0;
        int prevScore =0;
        int prevCount =0;
     List<Pizza> best = new ArrayList();
        List<Pizza> usedList = new ArrayList();
     //1,2 - 1   --o,1

    for(int x=0;x<=l.size()-size;x++) {

//        Pizza p = l.get(x);
//        List<Pizza> list =  l.stream().filter(pizza -> {
//            long countNew2 = pizza.getIngredients().stream()
//                    .filter((s) -> !pizza.getIngredients().contains(s)).count();
//            return countNew2>0;
//        }).collect(Collectors.toList());
//        if(list.size()<1)
//            list = l;
      //  List<Pizza> list = l;

                AtomicInteger groupPoints = new AtomicInteger();
        HashSet used = new HashSet();
        List<Pizza> b = new ArrayList();
        for (int y = 0; y < size && y+x< l.size(); y++) {
           // Pizza p = list.get(x+y);
             l.stream().filter(pizza -> {
                 return !usedList.contains(pizza);
             }).filter(pizza -> {
                long countNew2 = pizza.getIngredients().stream()
                        .filter((s) -> !used.contains(s)).count();
                return countNew2>0;
            }).findAny().ifPresentOrElse(pizza -> {
                 long countNew2 = pizza.getIngredients().stream()
                         .filter((s) -> !used.contains(s)).count();
                 groupPoints.addAndGet((int) countNew2);
                 used.addAll(pizza.getIngredients());
                 b.add(pizza);
                 usedList.add(pizza);
             },() -> {
                 l.stream().filter(pizza -> {
                     return !usedList.contains(pizza);
                 }).findFirst().ifPresent(pizza -> {
                     long countNew2 = pizza.getIngredients().stream()
                             .filter((s) -> !used.contains(s)).count();
                     groupPoints.addAndGet((int) countNew2);
                     used.addAll(pizza.getIngredients());
                     b.add(pizza);
                     usedList.add(pizza);
                 });
             });



        }


        System.out.println("best "+ "%s of %s groupby %s ".formatted(x,l.size(),size)+" "+ groupPoints + " vs " +bestScore);

        if(groupPoints.get() >bestScore) {
            bestScore = groupPoints.get();
            best = new ArrayList<>(b);
        }

        if(prevScore <= bestScore){
            prevCount++;

        }else{
            prevCount =0;
        }
        prevScore = groupPoints.get();

        //if max marks obtained -- short circuit
        int t =b.stream().mapToInt(value -> value.getIngredients().size()).sum();
if(t==bestScore){//found max score..short
    System.out.println("shortcircuit bestScore "+ "%s of %s ".formatted(x,l.size())+ " "+bestScore);
    return new PizScore(best,bestScore);
}
        //if x checks yield same best.. break
        if(prevCount>4){ //(l.size()/10)
            System.out.println("shortcircuit "+ "%s of %s ".formatted(x,l.size()));
            return new PizScore(best,bestScore);
        }

    }
    return new PizScore(best,bestScore);
    }
    public  void permutations2(List<String> s)
    {
        // create an empty ArrayList to store (partial) permutations
        List<List<String>> partial = new ArrayList<>();

        // initialize the list with the first character
        partial.add(List.of(s.get(0)));

        // do for every character of the specified list
        for (int i = 1; i < s.size(); i++)
        {
            // consider previously constructed partial permutation one by one

            // (iterate backwards to avoid ConcurrentModificationException)
            for (int j = partial.size() - 1; j >= 0 ; j--)
            {
                // remove current partial permutation from the ArrayList
                List<String> str = partial.remove(j);

                // Insert next character of the specified string in all
                // possible positions of current partial permutation. Then
                // insert each of these newly constructed string in the list

                for (int k = 0; k <= str.size(); k++)
                {
                    // partial.add(str.substring(0, k) + s.charAt(i) + str.substring(k));
                    List<String> l = new ArrayList<>(str.subList(0, k));
                    l.add(s.get(i));
                    l.addAll(str.subList(k, str.size()));
                    partial.add(l);
                    System.out.println(l);
                }
            }
        }

        System.out.println(s.size() + " " +partial.size());
        System.out.println(partial);
    }

}
