// ⚡ Spring Boot Assessment - 500 Error Debugging Exercises

/* EXERCISE 1: Missing Bean Configuration
 * Problem: NullPointerException due to missing @Service annotation
 * Expected Error: HTTP 500 - BeanCreationException
 */

// UserController.java - This will fail
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService; // This will be null!
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id); // NullPointerException here
        return ResponseEntity.ok(user);
    }
}

// UserService.java - BROKEN VERSION (missing @Service)
public class UserService {
    public User findById(Long id) {
        return new User(id, "John Doe", "john@example.com");
    }
}

// SOLUTION: Add @Service annotation
@Service
public class UserService {
    public User findById(Long id) {
        return new User(id, "John Doe", "john@example.com");
    }
}

/* EXERCISE 2: Database Connection Issue
 * Problem: Missing datasource configuration
 * Expected Error: HTTP 500 - DataSourceException
 */

// UserRepository.java - This will fail without proper DB config
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByEmail(String email);
}

// UserController.java - Database operation
@RestController
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Will fail if no datasource configured
    }
}

// SOLUTION: Add to application.properties
/*
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
*/

/* EXERCISE 3: Circular Dependency
 * Problem: Two services depend on each other
 * Expected Error: HTTP 500 - BeanCurrentlyInCreationException
 */

// ServiceA.java - BROKEN VERSION
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB; // Circular dependency!
    
    public String processA() {
        return "A: " + serviceB.processB();
    }
}

// ServiceB.java - BROKEN VERSION  
@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA; // Circular dependency!
    
    public String processB() {
        return "B: " + serviceA.processA();
    }
}

// SOLUTION: Use @Lazy annotation
@Service
public class ServiceA {
    @Autowired
    @Lazy
    private ServiceB serviceB; // Lazy loading breaks the cycle
    
    public String processA() {
        return "A: " + serviceB.processB();
    }
}

/* EXERCISE 4: Invalid Request Mapping
 * Problem: Conflicting URL mappings
 * Expected Error: HTTP 500 - IllegalStateException
 */

// BROKEN VERSION - Conflicting mappings
@RestController
public class ProductController {
    
    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable String id) {
        return new Product(id, "Product " + id);
    }
    
    @GetMapping("/products/{name}") // CONFLICT! Same path pattern
    public Product getProductByName(@PathVariable String name) {
        return new Product("1", name);
    }
}

// SOLUTION: Use different paths or request params
@RestController
public class ProductController {
    
    @GetMapping("/products/id/{id}")
    public Product getProduct(@PathVariable String id) {
        return new Product(id, "Product " + id);
    }
    
    @GetMapping("/products/name/{name}")
    public Product getProductByName(@PathVariable String name) {
        return new Product("1", name);
    }
    
    // Or use request parameters
    @GetMapping("/products")
    public Product getProductByParam(@RequestParam(required = false) String id,
                                   @RequestParam(required = false) String name) {
        if (id != null) return new Product(id, "Product " + id);
        if (name != null) return new Product("1", name);
        throw new IllegalArgumentException("Either id or name parameter required");
    }
}

/* EXERCISE 5: JSON Serialization Error
 * Problem: Infinite recursion in entity relationships
 * Expected Error: HTTP 500 - JsonMappingException
 */

// BROKEN VERSION - Bidirectional relationship without proper handling
@Entity
public class Author {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    
    @OneToMany(mappedBy = "author")
    private List<Book> books; // Will cause infinite recursion when serializing
    
    // constructors, getters, setters...
}

@Entity  
public class Book {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    
    @ManyToOne
    private Author author; // Circular reference!
    
    // constructors, getters, setters...
}

// SOLUTION: Use @JsonIgnore or @JsonManagedReference/@JsonBackReference
@Entity
public class Author {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    
    @OneToMany(mappedBy = "author")
    @JsonManagedReference
    private List<Book> books;
    
    // constructors, getters, setters...
}

@Entity
public class Book {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    
    @ManyToOne
    @JsonBackReference
    private Author author;
    
    // constructors, getters, setters...
}

/* EXERCISE 6: Age Filtering Logic
 * Problem: Data filtering causing 500 error
 * Sample Data: People aged 19, 22, 35 - return only 20+ year olds
 * Expected Error: Various depending on implementation issue
 */

// Person.java - Entity
@Entity
public class Person {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private int age;
    
    public Person() {}
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}

// BROKEN VERSION - Multiple potential issues
@RestController
@RequestMapping("/api/people")
public class PersonController {
    
    @Autowired
    private PersonService personService; // Could be null if @Service missing
    
    @GetMapping("/adults")
    public List<Person> getAdults() {
        // Common issues that cause 500 errors:
        return personService.getAdultsOnly(); // NPE if service is null
    }
}

// PersonService.java - BROKEN VERSION
// @Service // MISSING ANNOTATION - causes 500 error
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;
    
    public List<Person> getAdultsOnly() {
        List<Person> allPeople = personRepository.findAll();
        List<Person> adults = new ArrayList<>();
        
        for (Person person : allPeople) {
            // BROKEN: Using >= 20 but could have null age
            if (person.getAge() >= 20) { // NPE if age is null
                adults.add(person);
            }
        }
        return adults;
    }
}

// SOLUTION VERSION
@Service
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;
    
    public List<Person> getAdultsOnly() {
        // Option 1: Handle in service layer
        List<Person> allPeople = personRepository.findAll();
        return allPeople.stream()
                .filter(person -> person.getAge() != null && person.getAge() >= 20)
                .collect(Collectors.toList());
    }
    
    // Option 2: Use repository query (more efficient)
    public List<Person> getAdultsOnlyWithQuery() {
        return personRepository.findByAgeGreaterThanEqual(20);
    }
}

// PersonRepository.java
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByAgeGreaterThanEqual(int age);
}

// Data initialization for testing
@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private PersonRepository personRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Sample data: ages 19, 22, 35
        personRepository.save(new Person("Alice", 19));  // Should NOT appear in results
        personRepository.save(new Person("Bob", 22));    // Should appear
        personRepository.save(new Person("Carol", 35));  // Should appear
        
        System.out.println("Sample data loaded: Alice(19), Bob(22), Carol(35)");
        System.out.println("Expected adults (20+): Bob(22), Carol(35)");
    }
}

/* DEBUGGING CHECKLIST FOR 500 ERRORS:
 * 
 * 1. Check application logs for stack traces
 * 2. Verify all @Service, @Repository, @Component annotations
 * 3. Check application.properties for database/config issues
 * 4. Look for circular dependencies in @Autowired fields
 * 5. Verify URL mappings don't conflict
 * 6. Check for JSON serialization issues with entity relationships
 * 7. Ensure proper exception handling in controllers
 * 8. Verify database schema matches JPA entities
 * 9. Check for missing required dependencies in pom.xml
 * 10. Look for typos in configuration property names
 */