import java.io.*;
import java.util.*;
import java.util.stream.Collectors;


public class SolutionHashcode3 {
    class Pizza {
        private Set<String> ingredients = new HashSet<>();

        public void setIngredients(Set<String> ingredients) {
            this.ingredients = ingredients;
        }

        public int getNewIngredients() {
            return newIngredients;
        }

        public void setUsedIngredient(int uniqueIngredients) {
            this.usedIngredients = uniqueIngredients;
        }
        public int getUsedIngredients() {
            return usedIngredients;
        }

        public void setNewIngredient(int uniqueIngredients) {
            this.newIngredients = uniqueIngredients;
        }

        private int newIngredients =0;
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
        var result = new SolutionHashcode3();
        result.pizzaDeliverer("d_many_pizzas");

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
            List<Pizza> list = Arrays.stream(pizzas).sorted((o1, o2) -> {
                return o2.getIngredients().size()-o1.getIngredients().size();
            }).collect(Collectors.toList());




            //divide pizza and count marks

           // used.clear();
            long pizzasLeft = list.size();
            long total =0;
            List<String> out = new ArrayList<>();
           //= sortRank(list,4);

            List<Pizza> bs4  = sortRank(new ArrayList<>(list),4);
            Integer t4 =bs4.stream().limit(teamsCount[2]*4).map(Pizza::getNewIngredients).reduce(0,(integer, aLong) -> integer+aLong);
            Integer ti4 =bs4.stream().limit(teamsCount[2]*4).map(pizza -> pizza.getIngredients().size()).reduce(0,(integer, aLong) -> integer+aLong);

            List<Pizza> bs3  = sortRank(new ArrayList<>(list),3);
            Integer t3 =bs3.stream().limit(teamsCount[1]*3).map(Pizza::getNewIngredients).reduce(0,(integer, aLong) -> integer+aLong);
            Integer ti3 =bs4.stream().limit(teamsCount[1]*3).map(pizza -> pizza.getIngredients().size()).reduce(0,(integer, aLong) -> integer+aLong);

            List<Pizza> bs2  = sortRank(new ArrayList<>(list),2);
            Integer t2 =bs2.stream().limit(teamsCount[0]*2).map(Pizza::getNewIngredients).reduce(0,(integer, aLong) -> integer+aLong);
            Integer ti2 =bs2.stream().limit(teamsCount[0]*2).map(pizza -> pizza.getIngredients().size()).reduce(0,(integer, aLong) -> integer+aLong);

            List<Pizza> bs = list;


            List<Integer> l =  new ArrayList<>(List.of(t4,t3,t2));
            l.sort(Collections.reverseOrder());
            List<Integer> lindex =  new ArrayList<>();
            l.forEach(aLong -> {
                int s=0;
                if(aLong==t2) s= 0;
                if(aLong==t3) s= 1;
                if(aLong==t4) s= 2;

                lindex.add(s);
            });

                for(int x=0;x<lindex.size();x++){
                    int s = switch (lindex.get(x)){
                        case 0 ->  2;
                        case 1 ->  3;
                        case 2 ->  4;
                        default -> throw new IllegalStateException("Unexpected value: " + lindex.get(x));
                    };
                    bs  = sortRank(bs,s);
                    long groupPoints = 0;
                    for(int z=0;z<teamsCount[lindex.get(x)];z++){
                        if(s<=pizzasLeft){
                            String team= "";
                            for(int y=0;y<s;y++){
                                Pizza p = bs.remove(0);
                                groupPoints +=p.getNewIngredients();
                                pizzasLeft -=1;
                                team +=" "+p.getId();

                            }
                            out.add(s +team);
                            System.out.println(s +team +" groupPoints " +groupPoints);
                            total += Math.pow(groupPoints,2);
                            System.out.println(" groupPoints  total " +Math.pow(groupPoints,2));


                        }else{
                            break;
                        }

                    }

                }


            // Print output data and create output file
            try (PrintWriter output = new PrintWriter(outputFilesDirectory + fileName + ".out", "UTF-8")) {
                output.println(out.size());
                System.out.println(out.size() + " - " +total);
                for (String outputLine : out) {
                    output.println(outputLine );
                    System.out.println(outputLine );
                }
            }

            System.out.println("");






/*            // determine the size of delivered teams
            int smallestTeam = -1;
            for (int i = 0; i < 2; ++i) {
                if (teamsCount[i] > 0){
                    smallestTeam = i+2;
                    break;
                }
            }
            Queue<Team> deliveredTeams = new PriorityQueue<>();
            if (numOfPizza % 2 == 1 && teamsCount[1] > 0) {
                deliveredTeams.add(new Team(3));
                numOfPizza -= 3;
            }
            for (int i = 0; i < 3; ++i) {
                if (numOfPizza == 0) break;
                while (teamsCount[i] > 0 && numOfPizza - (i+2) >= 0)  {
                    deliveredTeams.add(new Team(i+2));
                    teamsCount[i]--;
                    numOfPizza -= (i+2);
                    System.out.println(numOfPizza);
                }
            }
            while (!deliveredTeams.isEmpty()) {
                System.out.println(deliveredTeams.poll().getSize());
            }*/

            // Print output data and create output file
//            try (PrintWriter output = new PrintWriter(outputFilesDirectory + fileName + ".out", "UTF-8")) {
//                output.println(outputList.size());
//                System.out.println(outputList.size());
//                for (Integer outputLine : outputList) {
//                    output.print(outputLine + " ");
//                    System.out.print(outputLine + " ");
//                }
//            }
//
//            System.out.println("");

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

    List<Pizza>  sortRank(List<Pizza> list,int groupSize){
        List<Pizza> bigToSmall = new ArrayList<>();
     //   List<Pizza> commonToLeast = new ArrayList<>();
     //   List<Pizza> commonPool = new ArrayList<>();
        Set<String> used = new HashSet<>();
 int size = list.size();
 HashMap<Integer,List> m = new HashMap<>();


        for(int x=list.size()-1;x>=0;x--){
            System.out.println("sorting ... "+groupSize+" "+x);
            list.stream().limit(5).forEach(pizza -> System.out.println(pizza.getId()+" "+used.size()+ " "+pizza.getIngredients().size()+" "+pizza.getNewIngredients()));
            //sort by ingredient size/marks
            int sub= 20<list.size()?20:list.size()-1;
            list.subList(0,sub).sort((o1, o2) -> {
                long countNew2 = o2.getIngredients().stream()
                        .filter((s) -> !used.contains(s)).count();
                o2.setNewIngredient((int) countNew2);
                long countNew1 = o1.getIngredients().stream()
                        .filter((s) -> !used.contains(s)).count();
               // o1.setNewIngredient((int) countNew1);
                return (int) ( countNew2-countNew1);
            });

            // if(bigpos!=0){
            Pizza pizza = list.remove(0);
            long countNew = pizza.getIngredients().stream()
                    .filter((s) -> !used.contains(s)).count();
            pizza.setNewIngredient((int) countNew);
            bigToSmall.add(pizza);
            used.addAll(pizza.getIngredients());
            if((size-x) %groupSize ==0){
                used.clear();
            }

            //find most matching
//            List<Pizza> tmp= new ArrayList<Pizza>(list);
//            tmp.sort((o1, o2) -> {
//                long countNew1 = o1.getIngredients().stream().filter((s) -> !pizza.getIngredients().contains(s)).count();
//                long countUsed1 = o1.getIngredients().stream().filter((s) -> pizza.getIngredients().contains(s)).count();
//                long countNew2 = o2.getIngredients().stream().filter((s) -> !pizza.getIngredients().contains(s)).count();
//                long countUsed2 = o2.getIngredients().stream().filter((s) -> pizza.getIngredients().contains(s)).count();
//
//                return (int) (countUsed2-countUsed1);
//            });

//            for(int y=1;y<groupSize;y++){
//                if(tmp.size()>0) {
//                    Pizza p = tmp.remove(0);
//                    list.remove(p);x--;
//                    long cn = p.getIngredients().stream().filter((s) -> !used.contains(s)).count();
//                    p.setNewIngredient(cn);
//                    bigToSmall.add(p);
//                    used.addAll(p.getIngredients());
//                }
//            }


            //     }

//            for(int y=teamsCount.length-1;y>=0;y--){
//
//
//
//                //   bs  = sortRank(bs,(y+1));
//                bs  = sortRank(bs,(y));
//                long good= bs.size();//bs.stream().filter(p -> p.getNewIngredients()>0).count();
//                int numGroups = (int) (good/(y+2));
//
//                long fed = Math.min(numGroups,teamsCount[y]);
//                long groupPoints = 0;
//
//                String team= "";
//                HashSet teamRank = new HashSet<>();
//                // bs  = sortRank(bs,new HashSet<>());;
//                for(int x=0;x<fed*(y+2);x++){ //0 1 2 3 4 5 6
//                    Pizza p = null;
//
//                    p = bs.remove(0);
//
//
//                    groupPoints +=p.getNewIngredients();
//                    pizzasLeft -=1;
//
//                    team +=" "+p.getId();
//                    // teamRank.addAll(p.getIngredients());
//                    if((x+1)%(y+2)==0 && x!=0){
//                        out.add((y+2) +team);
//                        System.out.println((y+2) +team +" groupPoints " +groupPoints);
//                        team ="";
//                        // teamRank.clear();
//                        //  bs = sortRank(bs,(y+2));//teamRank,
//                    }
//                }
//                total += Math.pow(groupPoints,2);
//                System.out.println(" groupPoints  total " +Math.pow(groupPoints,2));
//                if(!team.isEmpty())
//                    out.add((y+2) +team);
//
//            }

        }

        return bigToSmall;
    }
}
