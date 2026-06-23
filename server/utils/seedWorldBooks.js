const supabase = require('../config/supabase');

const worldBooks = [
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    description: "Cien años de soledad is a masterpiece of magical realism that tells the multi-generational story of the Buendía family.",
    price: 1599,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    stock: 50,
    language: "Spanish",
    is_featured: true,
    is_best_seller: true
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    description: "A profound story of injustice, heroism, and love following the life of Jean Valjean in 19th century France.",
    price: 2250,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80",
    stock: 30,
    language: "French",
    is_featured: true,
    is_best_seller: false
  },
  {
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    description: "A magnificent coming-of-age story steeped in nostalgia, following Toru Watanabe's memories of his youth.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1525011268546-bf3f9b007f6a?w=500&q=80",
    stock: 45,
    language: "Japanese",
    is_featured: false,
    is_best_seller: true
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    description: "A psychological drama following Rodion Raskolnikov's struggle with guilt and redemption.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80",
    stock: 25,
    language: "Russian",
    is_featured: true,
    is_best_seller: false
  },
  {
    title: "The Prophet",
    author: "Kahlil Gibran",
    description: "A collection of poetic essays that are philosophical, spiritual, and, above all, inspirational.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80",
    stock: 60,
    language: "Arabic",
    is_featured: false,
    is_best_seller: true
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    description: "An ancient Chinese military treatise dating from the Late Spring and Autumn Period.",
    price: 999,
    image: "https://images.unsplash.com/photo-1585800052378-005118fae49d?w=500&q=80",
    stock: 100,
    language: "Mandarin",
    is_featured: true,
    is_best_seller: true
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    price: 1150,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80",
    stock: 40,
    language: "English",
    is_featured: false,
    is_best_seller: true
  },
  {
    title: "Divine Comedy",
    author: "Dante Alighieri",
    description: "An epic poem that describes Dante's journey through Hell, Purgatory, and Paradise.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efac4?w=500&q=80",
    stock: 15,
    language: "Italian",
    is_featured: true,
    is_best_seller: false
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about the serious issues of rape and racial inequality told through the eyes of a child.",
    price: 1099,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    stock: 50,
    language: "English",
    is_featured: true,
    is_best_seller: true
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "The story of Holden Caulfield's experiences in New York City after being expelled from prep school.",
    price: 1350,
    image: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?w=500&q=80",
    stock: 20,
    language: "English",
    is_featured: false,
    is_best_seller: true
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    price: 1750,
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&q=80",
    stock: 75,
    language: "English",
    is_featured: true,
    is_best_seller: true
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A children's fantasy novel about the quest of home-loving hobbit Bilbo Baggins.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=500&q=80",
    stock: 80,
    language: "English",
    is_featured: true,
    is_best_seller: true
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    description: "The narrative of sailor Ishmael's obsessive quest against the white whale, Moby Dick.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=500&q=80",
    stock: 12,
    language: "English",
    is_featured: false,
    is_best_seller: false
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that follows the character development of Elizabeth Bennet.",
    price: 1250,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    stock: 35,
    language: "English",
    is_featured: true,
    is_best_seller: true
  }
];

const seedData = async () => {
  try {
    // Clear existing books to allow re-seeding with updated data
    console.log('Clearing existing books...');
    await supabase.from('books').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    // Make sure 'World Literature' category exists
    let { data: category } = await supabase.from('categories').select('id').eq('name', 'World Literature').single();
    
    if (!category) {
      const { data: newCategory, error } = await supabase.from('categories').insert([{
        name: 'World Literature',
        description: 'A diverse collection of books from around the globe in multiple languages.',
        image: 'https://images.unsplash.com/photo-1456953180671-730de08edaa7?w=500&q=80'
      }]).select('id').single();
      
      if (error) throw error;
      category = newCategory;
      console.log('Created World Literature category');
    }

    // Attach category ID to books
    const booksToInsert = worldBooks.map(book => ({
      ...book,
      category_id: category.id
    }));

    // Insert new books
    const { error } = await supabase.from('books').insert(booksToInsert);
    if (error) throw error;
    
    console.log('Successfully seeded world books!');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => process.exit(0)).catch(() => process.exit(1));
}
