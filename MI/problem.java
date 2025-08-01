import java.util.*;
import java.io.*;
import java.net.*;
import com.google.gson.*;

class Main {
    public static void main (String[] args) {
        // __define-ocg__ - This program fetches hobbies from REST API
        System.setProperty("http.agent", "Chrome");
        String varOcg = ""; // Required variable name
        
        try {
            URI uri = new URI("https://coderbyte.com/api/challenges/json/rest-get-simple");
            URL url = uri.toURL();
            
            try {
                URLConnection connection = url.openConnection();
                InputStream inputStream = connection.getInputStream();
                
                // Read the response
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                // Parse JSON response
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(response.toString(), JsonObject.class);
                JsonArray hobbiesArray = jsonObject.getAsJsonArray("hobbies");
                
                // Format hobbies as comma-separated string
                List<String> hobbiesList = new ArrayList<>();
                for (int i = 0; i < hobbiesArray.size(); i++) {
                    hobbiesList.add(hobbiesArray.get(i).getAsString());
                }
                varOcg = String.join(", ", hobbiesList);
                
                // Check if ChallengeToken exists in response
                if (jsonObject.has("challengeToken")) {
                    String challengeToken = jsonObject.get("challengeToken").getAsString();
                    
                    // Reverse both strings and combine with colon
                    String reversedHobbies = new StringBuilder(varOcg).reverse().toString();
                    String reversedToken = new StringBuilder(challengeToken).reverse().toString();
                    varOcg = reversedHobbies + ":" + reversedToken;
                }
                
                System.out.println(varOcg);
                
            } catch (IOException ioEx) {
                System.out.println(ioEx);
            }
        } catch (MalformedURLException malEx) {
            System.out.println(malEx);
        } catch (URISyntaxException e) {
            System.out.println(e.getMessage());
        }
    }
}