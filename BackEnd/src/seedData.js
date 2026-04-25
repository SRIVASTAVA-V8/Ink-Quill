const seedData = {
  books: [
    {
      title: 'The Last Wish',
      author: 'Andrzej Sapkowski',
      description: 'A fantasy short story collection from The Witcher universe.',
      ISBN: '9780143129980',
      price: 12.99,
      discount: 10,
      category: 'Fantasy',
      tags: ['fantasy', 'adventure', 'witcher'],
      stock: 25,
      language: 'English',
      publisher: 'Orbit',
      publishedDate: new Date('2015-04-14'),
      image: ['last-wish.jpg']
    },
  
    {
      title: 'Becoming',
      author: 'Michelle Obama',
      description: 'A memoir by the former First Lady of the United States.',
      ISBN: '9781524763138',
      price: 18.5,
      discount: 0,
      category: 'Biography',
      tags: ['memoir', 'inspirational'],
      stock: 20,
      language: 'English',
      publisher: 'Crown',
      publishedDate: new Date('2018-11-13'),
      image: ['becoming.jpg']
    },
// new data 
  {
    "title": "The Way of Kings",
    "author": "Brandon Sanderson",
    "description": "The first volume in the epic Stormlight Archive series, following four characters in a world of high storms.",
    "ISBN": "9780765326355",
    "price": 24.99,
    "discount": 15,
    "category": "Fantasy",
    "tags": ["Epic", "High Magic", "Worldbuilding"],
    "stock": 40,
    "language": "English",
    "publisher": "Tor Books",
    "publishedDate": "2010-08-31T00:00:00.000+00:00",
    "image": ["https://example.com/wayofkings.jpg"],
    "ratingAvg": 4.66,
    "ratingCount": 691322
  },
  {
    "title": "Project Hail Mary",
    "author": "Andy Weir",
    "description": "A lone astronaut must save the earth from an extinction-level threat using science and logic.",
    "ISBN": "9780593135204",
    "price": 18.00,
    "discount": 5,
    "category": "Sci-Fi",
    "tags": ["Space Travel", "Survival", "Hard Sci-Fi"],
    "stock": 15,
    "language": "English",
    "publisher": "Ballantine Books",
    "publishedDate": "2021-05-04T00:00:00.000+00:00",
    "image": ["https://example.com/hailmary.jpg"],
    "ratingAvg": 4.51,
    "ratingCount": 420000
  },
  {
    "title": "Atomic Habits",
    "author": "James Clear",
    "description": "An easy and proven way to build good habits and break bad ones.",
    "ISBN": "9780735211292",
    "price": 16.20,
    "discount": 20,
    "category": "Non-Fiction",
    "tags": ["Productivity", "Psychology", "Habits"],
    "stock": 100,
    "language": "English",
    "publisher": "Avery",
    "publishedDate": "2018-10-16T00:00:00.000+00:00",
    "image": ["https://example.com/atomichabits.jpg"],
    "ratingAvg": 4.32,
    "ratingCount": 1348074
  },
  {
    "title": "The Seven Husbands of Evelyn Hugo",
    "author": "Taylor Jenkins Reid",
    "description": "An aging Hollywood movie icon is finally ready to tell the truth about her glamorous and scandalous life.",
    "ISBN": "9781501161933",
    "price": 17.00,
    "discount": 10,
    "category": "Romance",
    "tags": ["Historical Fiction", "Hollywood", "LGBTQ+"],
    "stock": 35,
    "language": "English",
    "publisher": "Atria Books",
    "publishedDate": "2017-06-13T00:00:00.000+00:00",
    "image": ["https://example.com/evelynhugo.jpg"],
    "ratingAvg": 4.39,
    "ratingCount": 4213766
  },
  {
    "title": "Dune",
    "author": "Frank Herbert",
    "description": "The masterpiece of science fiction set on the desert planet Arrakis.",
    "ISBN": "9780441172719",
    "price": 10.99,
    "discount": 0,
    "category": "Sci-Fi",
    "tags": ["Classic", "Politics", "Adventure"],
    "stock": 50,
    "language": "English",
    "publisher": "Ace",
    "publishedDate": "1990-09-01T00:00:00.000+00:00",
    "image": ["https://example.com/dune.jpg"],
    "ratingAvg": 4.29,
    "ratingCount": 1655886
  },
  {
    "title": "Circe",
    "author": "Madeline Miller",
    "description": "A bold and subversive retelling of the goddess Circe’s life.",
    "ISBN": "9780316556347",
    "price": 16.99,
    "discount": 12,
    "category": "Fantasy",
    "tags": ["Greek Myth", "Magic", "Retelling"],
    "stock": 28,
    "language": "English",
    "publisher": "Little, Brown and Company",
    "publishedDate": "2018-04-10T00:00:00.000+00:00",
    "image": ["https://example.com/circe.jpg"],
    "ratingAvg": 4.22,
    "ratingCount": 1389182
  },
  {
    "title": "The Silent Patient",
    "author": "Alex Michaelides",
    "description": "A woman shoots her husband five times and then never speaks another word.",
    "ISBN": "9781250301697",
    "price": 26.99,
    "discount": 25,
    "category": "Mystery",
    "tags": ["Psychological", "Suspense", "Thriller"],
    "stock": 60,
    "language": "English",
    "publisher": "Celadon Books",
    "publishedDate": "2019-02-05T00:00:00.000+00:00",
    "image": ["https://example.com/silentpatient.jpg"],
    "ratingAvg": 4.16,
    "ratingCount": 3394037
  },
  {
    "title": "A Court of Thorns and Roses",
    "author": "Sarah J. Maas",
    "description": "A huntress is dragged to a magical kingdom for the murder of a faerie.",
    "ISBN": "9781619634442",
    "price": 19.00,
    "discount": 10,
    "category": "Romance",
    "tags": ["Fae", "Fantasy", "Magic"],
    "stock": 45,
    "language": "English",
    "publisher": "Bloomsbury",
    "publishedDate": "2015-05-05T00:00:00.000+00:00",
    "image": ["https://example.com/acotar.jpg"],
    "ratingAvg": 4.15,
    "ratingCount": 4353204
  },
  {
    "title": "Normal People",
    "author": "Sally Rooney",
    "description": "The story of mutual fascination, friendship and love between two people.",
    "ISBN": "9781984822178",
    "price": 17.00,
    "discount": 5,
    "category": "Fiction",
    "tags": ["Literary", "Irish", "Romance"],
    "stock": 20,
    "language": "English",
    "publisher": "Hogarth",
    "publishedDate": "2019-04-16T00:00:00.000+00:00",
    "image": ["https://example.com/normalpeople.jpg"],
    "ratingAvg": 3.79,
    "ratingCount": 1639000
  },
  {
    "title": "Thinking, Fast and Slow",
    "author": "Daniel Kahneman",
    "description": "A look at the two systems that drive the way we think.",
    "ISBN": "9780374275631",
    "price": 20.00,
    "discount": 15,
    "category": "Non-Fiction",
    "tags": ["Cognition", "Economics", "Psychology"],
    "stock": 18,
    "language": "English",
    "publisher": "Farrar, Straus and Giroux",
    "publishedDate": "2011-10-25T00:00:00.000+00:00",
    "image": ["https://example.com/thinkingfast.jpg"],
    "ratingAvg": 4.17,
    "ratingCount": 598328
  },
  {
    "title": "Dark Matter",
    "author": "Blake Crouch",
    "description": "A brilliant physics professor is kidnapped and wakes up in a reality where his life is completely different.",
    "ISBN": "9781101904220",
    "price": 14.00,
    "discount": 8,
    "category": "Sci-Fi",
    "tags": ["Parallel Universe", "Thriller", "Mind-Bending"],
    "stock": 30,
    "language": "English",
    "publisher": "Crown",
    "publishedDate": "2016-07-26T00:00:00.000+00:00",
    "image": ["https://example.com/darkmatter.jpg"],
    "ratingAvg": 4.13,
    "ratingCount": 754357
  },
  {
    "title": "The Poppy War",
    "author": "R.F. Kuang",
    "description": "An orphan girl is admitted to a prestigious military academy and discovers shamanic powers.",
    "ISBN": "9780062662569",
    "price": 18.99,
    "discount": 10,
    "category": "Fantasy",
    "tags": ["Military", "Historical", "Dark"],
    "stock": 22,
    "language": "English",
    "publisher": "Harper Voyager",
    "publishedDate": "2018-05-01T00:00:00.000+00:00",
    "image": ["https://example.com/poppywar.jpg"],
    "ratingAvg": 4.16,
    "ratingCount": 508342
  },
  {
    "title": "Educated",
    "author": "Tara Westover",
    "description": "A memoir about a woman born to survivalists in the mountains of Idaho.",
    "ISBN": "9780399590504",
    "price": 28.00,
    "discount": 30,
    "category": "Biography",
    "tags": ["Memoir", "True Story", "Education"],
    "stock": 55,
    "language": "English",
    "publisher": "Random House",
    "publishedDate": "2018-02-20T00:00:00.000+00:00",
    "image": ["https://example.com/educated.jpg"],
    "ratingAvg": 4.46,
    "ratingCount": 1901295
  },
  {
    "title": "Where the Crawdads Sing",
    "author": "Delia Owens",
    "description": "A mystery and coming-of-age story set in the marshes of North Carolina.",
    "ISBN": "9780735219090",
    "price": 15.00,
    "discount": 10,
    "category": "Mystery",
    "tags": ["Nature", "Fiction", "Bestseller"],
    "stock": 80,
    "language": "English",
    "publisher": "G.P. Putnam's Sons",
    "publishedDate": "2018-08-14T00:00:00.000+00:00",
    "image": ["https://example.com/crawdads.jpg"],
    "ratingAvg": 4.37,
    "ratingCount": 3691107
  },
  {
    "title": "Neuromancer",
    "author": "William Gibson",
    "description": "The seminal cyberpunk novel that introduced the concept of cyberspace.",
    "ISBN": "9780441569595",
    "price": 9.99,
    "discount": 0,
    "category": "Sci-Fi",
    "tags": ["Cyberpunk", "Classic", "AI"],
    "stock": 12,
    "language": "English",
    "publisher": "Ace Books",
    "publishedDate": "1984-07-01T00:00:00.000+00:00",
    "image": ["https://example.com/neuromancer.jpg"],
    "ratingAvg": 3.89,
    "ratingCount": 369296
  }
  ],

  users: [
    {
      name: 'Chakshu',
      email: 'chakshu@gmail.com',
      password: 'Password123',
      role: 'user',
      address: {
        fullName: 'Chakshu Sharma',
        phone: '9876543210',
        addressLine: '123 Book Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        isDefault: true
      },
      wishlist: [], // Will be populated with book IDs after insertion
      isActive: true
    },
    {
      name: 'Riya',
      email: 'riya@example.com',
      password: 'Password123',
      role: 'user',
      address: {
        fullName: 'Riya Patel',
        phone: '9123456780',
        addressLine: '45 Market Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India',
        isDefault: true
      },
      wishlist: [], // Will be populated with book IDs after insertion
      isActive: true
    }
  ],

  carts: [
    {
      userId: null, // Will be set to user1._id
      items: [
        {
          bookId: null, // Will be set to book1._id
          quantity: 2,
          priceAtAddTime: 12.99
        },
        {
          bookId: null, // Will be set to book2._id
          quantity: 1,
          priceAtAddTime: 16.99
        }
      ],
      totalAmount: (12.99 * 2) + 16.99
    }
  ],

  orders: [
    {
      userId: null, // Will be set to user1._id
      orderItems: [
        {
          bookId: null, // Will be set to book1._id
          title: 'The Last Wish',
          quantity: 1,
          price: 12.99
        },
        {
          bookId: null, // Will be set to book3._id
          title: 'Dune',
          quantity: 1,
          price: 14.99
        }
      ],
      shippingAddress: {
        fullName: 'Chakshu Sharma',
        phone: '9876543210',
        addressLine: '123 Book Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      paymentInfo: {
        method: 'CARD',
        status: 'completed',
        transactionId: 'TXN12345678'
      },
      paymentResult: {
        id: 'PAY_10001',
        status: 'completed',
        update_time: new Date().toISOString(),
        email: 'chakshu@gmail.com'
      },
      pricing: {
        subtotal: 12.99 + 14.99,
        discount: 0,
        deliveryCharges: 50,
        total: 12.99 + 14.99 + 50
      },
      orderStatus: 'placed',
      isPaid: true,
      paidAt: new Date()
    }
  ]
};

module.exports = seedData;