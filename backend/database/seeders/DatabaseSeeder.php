<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\Destination;
use App\Models\ServiceListing;
use App\Models\Enquiry;
use App\Models\EnquiryNote;
use App\Models\WebsiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with comprehensive Egypt tourism data.
     */
    public function run(): void
    {
        // 1. Initial Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@wecheapertours.com'],
            [
                'name' => 'WeCheaperTours Admin',
                'password' => Hash::make('admin123456'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Service Categories
        $categories = [
            [
                'name' => 'Excursions & Day Tours',
                'slug' => 'excursions',
                'description' => 'Guided day tours, historical pharaonic excursions, and cultural experiences across Egypt.',
                'icon' => 'Compass',
                'display_order' => 1,
            ],
            [
                'name' => 'Classic Nile Cruises',
                'slug' => 'nile-cruises',
                'description' => 'Unforgettable 5-star river cruises between Luxor and Aswan with full guided sightseeing.',
                'icon' => 'Ship',
                'display_order' => 2,
            ],
            [
                'name' => 'Car Rentals & Chauffeurs',
                'slug' => 'car-rentals',
                'description' => 'Chauffeured VIP sedans, family tourist vans, airport transfers, and intercity private travel.',
                'icon' => 'Car',
                'display_order' => 3,
            ],
            [
                'name' => 'Ferry Crossings',
                'slug' => 'ferry-crossings',
                'description' => 'Red Sea and Gulf of Aqaba maritime ferry route assistance and private crossing coordination.',
                'icon' => 'Anchor',
                'display_order' => 4,
            ],
            [
                'name' => 'Hotels & Vacation Rentals',
                'slug' => 'vacation-rentals',
                'description' => 'Handpicked serviced villas, boutique hotel suites, lagoon residences, and luxury apartments.',
                'icon' => 'Home',
                'display_order' => 5,
            ],
            [
                'name' => 'Personal Concierge',
                'slug' => 'concierge',
                'description' => 'Bespoke grocery delivery, traditional meal prep, shopping escort, and local errand handling.',
                'icon' => 'Bell',
                'display_order' => 6,
            ],
            [
                'name' => 'Event Planning',
                'slug' => 'events',
                'description' => 'Romantic proposals, Nile celebrations, pyramid dinners, and memorable gatherings in Egypt.',
                'icon' => 'CalendarHeart',
                'display_order' => 7,
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = ServiceCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. The 7 Destinations
        $destinationsData = [
            [
                'name' => 'Cairo & Giza',
                'slug' => 'cairo-giza',
                'summary' => 'The vibrant capital home to the Great Pyramids, the Grand Egyptian Museum, and Islamic Cairo.',
                'description' => 'Cairo is an extraordinary melting pot of millenniums of civilizations. From the monumental Pyramids of Giza and the Sphinx to the labyrinthine Khan El-Khalili bazaar and the Nile waterfront, Cairo offers an unforgettable sensory journey.',
                'main_image' => 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Cairo & Giza Day Tours, Pyramids, and Sightseeing | WeCheaperTours',
                'seo_description' => 'Discover Cairo and Giza excursions: Pyramids, Sphinx, Grand Egyptian Museum, and Old Cairo with top local guides.',
                'display_order' => 1,
            ],
            [
                'name' => 'Alexandria',
                'slug' => 'alexandria',
                'summary' => 'The Mediterranean pearl of Egypt, celebrated for its Roman catacombs, seaside citadel, and Biblioteca.',
                'description' => 'Founded by Alexander the Great, Alexandria captures the breezy coastal romance of the Mediterranean. Explore the Citadel of Qaitbay overlooking the ancient Pharos lighthouse site, the Catacombs of Kom El Shoqafa, and fresh seafood restaurants along the Corniche.',
                'main_image' => 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Alexandria Day Excursions and Seaside Tours | WeCheaperTours',
                'seo_description' => 'Explore the historic Mediterranean city of Alexandria. Catacombs, Qaitbay Fort, and fresh seafood experiences.',
                'display_order' => 2,
            ],
            [
                'name' => 'Luxor',
                'slug' => 'luxor',
                'summary' => 'The world\'s greatest open-air museum boasting Karnak, Luxor Temple, and the Valley of the Kings.',
                'description' => 'Luxor sits along the majestic Nile and houses one-third of the world’s ancient monuments. Marvel at towering columns in Karnak, walk inside the painted subterranean tombs of Tutankhamun and Ramesses, and float across the valley in a sunrise hot air balloon.',
                'main_image' => 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Luxor Temple and Valley of the Kings Tours | WeCheaperTours',
                'seo_description' => 'Unveil the grandeur of ancient Thebes with our Luxor excursions, private Egyptologist guides, and Nile sunset feluccas.',
                'display_order' => 3,
            ],
            [
                'name' => 'Aswan & Abu Simbel',
                'slug' => 'aswan-abu-simbel',
                'summary' => 'Nubian culture, Philae island temple, and the colossal rock-cut temples of Ramesses II.',
                'description' => 'Aswan is Egypt\'s southern jewel where the Nile flows around granite boulders and verdant islands. Visit the colorful Nubian villages, the romantic temple of Isis on Philae Island, and embark on a pilgrimage to Abu Simbel.',
                'main_image' => 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Aswan & Abu Simbel Temples Excursions | WeCheaperTours',
                'seo_description' => 'Discover the Nubian warmth of Aswan and the awe-inspiring Abu Simbel rock temples with certified local guides.',
                'display_order' => 4,
            ],
            [
                'name' => 'Sharm El-Sheikh',
                'slug' => 'sharm-el-sheikh',
                'summary' => 'Sinai Peninsula paradise famous for Ras Mohammed marine parks, desert safaris, and luxury beach resorts.',
                'description' => 'Nestled between the Sinai mountains and the azure Red Sea, Sharm El-Sheikh is renowned for world-class marine life, warm year-round sun, coral reefs, and desert quad-biking under starry skies.',
                'main_image' => 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Sharm El-Sheikh Red Sea Excursions & Desert Tours | WeCheaperTours',
                'seo_description' => 'Snorkeling trips, Ras Mohammed, Bedouin desert safari, and private transfers in Sharm El-Sheikh.',
                'display_order' => 5,
            ],
            [
                'name' => 'Hurghada',
                'slug' => 'hurghada',
                'summary' => 'Vibrant Red Sea coastal hub celebrated for sandy beaches, Giftun Islands, and aquatic adventures.',
                'description' => 'Hurghada offers miles of golden coast, crystal lagoons, and vibrant marinas. Perfect for families, couples, and watersport lovers seeking relaxation and Red Sea island excursions.',
                'main_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Hurghada Island Boat Trips & Day Excursions | WeCheaperTours',
                'seo_description' => 'Red Sea boat tours to Giftun Island, desert quad safaris, and private transfers in Hurghada.',
                'display_order' => 6,
            ],
            [
                'name' => 'Marsa Alam',
                'slug' => 'marsa-alam',
                'summary' => 'Pristine southern Red Sea haven with sea turtles, dugongs, and tranquil untouched beaches.',
                'description' => 'For travelers seeking serene natural beauty away from the crowds, Marsa Alam offers world-renowned diving and snorkeling reefs, mangrove lagoons, and tranquil emerald water.',
                'main_image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                ],
                'seo_title' => 'Marsa Alam Snorkeling & Wildlife Excursions | WeCheaperTours',
                'seo_description' => 'Encounter sea turtles, dugongs, and pristine coral reefs in Marsa Alam with custom private tours.',
                'display_order' => 7,
            ],
        ];

        $destinationModels = [];
        foreach ($destinationsData as $dest) {
            $destinationModels[$dest['slug']] = Destination::updateOrCreate(['slug' => $dest['slug']], $dest);
        }

        // 4. Excursions & Day Tours Listings (Multiple tours per region)
        $excursionCategory = $categoryModels['excursions'];
        $excursions = [
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Giza Pyramids, Great Sphinx & Grand Egyptian Museum',
                'slug' => 'giza-pyramids-sphinx-gem-tour',
                'summary' => 'Comprehensive private day excursion with a certified Egyptologist exploring the ancient wonders of Giza.',
                'description' => 'Stand before the sole remaining Wonder of the Ancient World. Your dedicated Egyptologist guide will share the engineering secrets of Khufu, Khafre, and Menkaure, lead you to the Great Sphinx, and provide exclusive guidance through the newly opened Grand Egyptian Museum galleries.',
                'duration' => '7 to 8 hours',
                'price_amount' => 65.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 1,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80'
                ],
                'highlights' => ['Private air-conditioned transport', 'Licensed English-speaking Egyptologist', 'Panoramic pyramid photo stop', 'Grand Egyptian Museum galleries'],
                'inclusions' => ['Pick up and drop-off from Cairo/Giza hotel', 'Private modern vehicle', 'Professional Egyptologist tour guide', 'Chilled bottled mineral water'],
                'exclusions' => ['Monument entry tickets', 'Lunch & personal beverages', 'Gratuities for guide & driver'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Islamic & Coptic Cairo with Khan El-Khalili Bazaar',
                'slug' => 'islamic-coptic-cairo-khan-khalili',
                'summary' => 'Walk the medieval streets of Al-Muizz, visit the Hanging Church, Saladin Citadel, and historic bazaar.',
                'description' => 'Discover Cairo’s profound multicultural heritage. Journey to Old Coptic Cairo to see Abu Serga where the Holy Family took refuge, the Ben Ezra Synagogue, and the Citadel of Saladin with the alabaster Mosque of Muhammad Ali. Conclude in the lively alleyways of Khan El-Khalili.',
                'duration' => '6 hours',
                'price_amount' => 50.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 2,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Saladin Citadel & Mosque of Muhammad Ali', 'Hanging Church of Old Cairo', 'Al-Muizz medieval Islamic street', 'Khan El-Khalili spice & craft souk'],
                'inclusions' => ['Hotel pickup & return in private sedan/van', 'Egyptologist guide', 'Complimentary Egyptian mint tea at historic café'],
                'exclusions' => ['Monument entry tickets', 'Personal shopping'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'East & West Banks of Luxor: Valley of the Kings & Karnak',
                'slug' => 'luxor-east-west-banks-private-tour',
                'summary' => 'Immerse yourself in ancient Egyptian glory across the Tombs of the Pharaohs and Karnak Temple.',
                'description' => 'Experience the epicenter of ancient Egyptian royal worship. Cross the Nile to the West Bank to visit the Valley of the Kings, the striking Mortuary Temple of Queen Hatshepsut, and the Colossi of Memnon. In the afternoon, explore the massive Hypostyle Hall at Karnak Temple and Luxor Temple.',
                'duration' => 'Full Day (8 hours)',
                'price_amount' => 85.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 3,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Subterranean royal pharaonic tombs', 'Hatshepsut cliffside temple', 'Karnak Hypostyle Hall', 'Private Nile-side lunch stop'],
                'inclusions' => ['Door-to-door hotel transfers', 'Private Egyptologist guide', 'Chilled water and soft drinks'],
                'exclusions' => ['Entry tickets to King Tut tomb', 'Gratuities for guide & driver'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'Luxor Sunrise Hot Air Balloon Flight over Ancient Thebes',
                'slug' => 'luxor-sunrise-hot-air-balloon',
                'summary' => 'Glide gently at dawn above the temples, Valley of the Kings, and green Nile riverbanks.',
                'description' => 'Take to the skies in a hot air balloon at sunrise. View the magnificent Colossi of Memnon, Queen Hatshepsut Temple, and the meeting of fertile Nile agriculture with rugged desert mountains.',
                'duration' => '3 hours (45-50 min flight)',
                'price_amount' => 75.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 4,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Early morning hotel pick-up & motorboat transfer', 'Spectacular sunrise over West Bank temples', 'Flight certificate issued by pilot'],
                'inclusions' => ['Hotel transfers', 'Safety briefing', 'Flight certificate'],
                'exclusions' => ['Personal video footage (optional)'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['aswan-abu-simbel']->id,
                'title' => 'Abu Simbel Sun Temples Day Trip from Aswan',
                'slug' => 'abu-simbel-sun-temples-day-trip',
                'summary' => 'Witness the colossal rock-hewn masterpiece of Ramesses II and Queen Nefertari overlooking Lake Nasser.',
                'description' => 'Depart across the Nubian desert to marvel at Abu Simbel, one of mankind\'s greatest architectural and modern salvage achievements. See the towering 20-meter statues of Ramesses II and the dedicated temple of Nefertari.',
                'duration' => '8 to 9 hours (Roundtrip)',
                'price_amount' => 95.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 5,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['The colossal Great Temple of Ramesses II', 'Temple of Hathor and Queen Nefertari', 'Lake Nasser panoramic vistas', 'Comfortable climate-controlled transport'],
                'inclusions' => ['Early morning hotel pick up and return', 'A/C private minibus', 'Local temple guide'],
                'exclusions' => ['Temple entry tickets', 'Breakfast box from hotel'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['aswan-abu-simbel']->id,
                'title' => 'Philae Island Temple & Colorful Nubian Village by Motorboat',
                'slug' => 'philae-island-temple-nubian-village',
                'summary' => 'Sail by traditional boat to the island sanctuary of Isis and the brightly painted Nubian settlement.',
                'description' => 'Visit the romantic island temple of Isis rescued from rising Nile waters. Afterward, cruise past Elephantine Island and the Nile cataracts to an authentic Nubian village with colorful earthen houses, local spices, and warm tea hospitality.',
                'duration' => '5 hours',
                'price_amount' => 60.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 6,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Boat ride to Philae Island', 'Nubian village cultural visit with tea', 'Aswan Cataracts panoramic viewpoints'],
                'inclusions' => ['Hotel transfers', 'Private boat transfers', 'English-speaking guide'],
                'exclusions' => ['Entry tickets', 'Henna tattoos (optional)'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['sharm-el-sheikh']->id,
                'title' => 'Ras Mohammed National Park Yacht & Snorkeling Cruise',
                'slug' => 'ras-mohammed-snorkeling-cruise',
                'summary' => 'Sail across the tip of the Sinai peninsula with three snorkeling stops at pristine coral gardens.',
                'description' => 'Ras Mohammed National Park hosts some of the richest marine biodiversity in the world. Spend a glorious day on a luxury yacht, snorkeling alongside sea turtles, clownfish, and kaleidoscopic coral reefs.',
                'duration' => '7 hours',
                'price_amount' => 45.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 7,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Three open-water snorkeling stops', 'White Island sandbar visit (weather permitting)', 'Freshly grilled buffet lunch onboard'],
                'inclusions' => ['Hotel pickup & drop-off', 'Buffet lunch & soft drinks', 'Snorkeling guide'],
                'exclusions' => ['Ras Mohammed national park entry fee ($5)', 'Snorkeling gear rental (optional)'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'title' => 'Orange Bay & Giftun Islands Speedboat Paradise Tour',
                'slug' => 'orange-bay-giftun-island-speedboat',
                'summary' => 'Cruise to the Egyptian Maldives with white sandy sandbars, shallow lagoons, and coral reefs.',
                'description' => 'Spend a heavenly day on Orange Bay at Giftun Island. Relax in over-water swings, walk on powder-soft sand, and snorkel among vibrant tropical schools of fish.',
                'duration' => '7 hours',
                'price_amount' => 40.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 8,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['2 hours relaxation on Orange Bay beach', '2 snorkeling stops on coral reefs', 'Buffet lunch and tropical fruits onboard'],
                'inclusions' => ['Hotel transfers in Hurghada', 'Island entry fees', 'Lunch & drinks'],
                'exclusions' => ['Water sports like parasailing (optional)'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['alexandria']->id,
                'title' => 'Alexandria Greco-Roman Catacombs & Citadel Day Tour',
                'slug' => 'alexandria-mediterranean-heritage-tour',
                'summary' => 'Full-day road excursion to the Roman catacombs, Pompey\'s Pillar, and seaside Qaitbay Citadel.',
                'description' => 'Escape the desert sands and journey to the cool Mediterranean breeze of Alexandria. Tour the subterranean Catacombs of Kom El Shoqafa, the imposing Qaitbay Fortress, and the modern Bibliotheca Alexandrina.',
                'duration' => '10 to 11 hours',
                'price_amount' => 90.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 9,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Catacombs of Kom El Shoqafa', 'Citadel of Qaitbay', 'Bibliotheca Alexandrina', 'Seafood lunch on the Mediterranean'],
                'inclusions' => ['Private hotel pickup & return', 'A/C private sedan or van', 'Private Egyptologist guide'],
                'exclusions' => ['Entry tickets', 'Lunch beverages'],
            ],
            [
                'category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['marsa-alam']->id,
                'title' => 'Sataya Reef Dolphin House Boat Trip in Marsa Alam',
                'slug' => 'sataya-reef-dolphin-house-marsa-alam',
                'summary' => 'Snorkel alongside wild spinner dolphin pods in a protected lagoon with crystal waters.',
                'description' => 'Sataya Dolphin Reef is considered one of the top marine encounters in the Red Sea. Swim respectfully near wild spinner dolphins, explore untouched reef pinnacles, and feast on fresh onboard lunch.',
                'duration' => 'Full Day (8 hours)',
                'price_amount' => 65.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 10,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Snorkeling with wild spinner dolphins', 'Protected turquoise lagoon', 'Seafood & chicken buffet on yacht'],
                'inclusions' => ['Hotel pickup/drop-off', 'Snorkeling equipment', 'Buffet lunch & drinks'],
                'exclusions' => ['National Park entry fee'],
            ],
        ];

        foreach ($excursions as $item) {
            ServiceListing::updateOrCreate(['slug' => $item['slug']], $item);
        }

        // 5. Classic Nile Cruises (The 3 Itineraries per Section 4.2)
        $cruiseCategory = $categoryModels['nile-cruises'];
        $cruises = [
            [
                'category_id' => $cruiseCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'Luxor to Aswan Classic Nile Cruise (4 Nights / 5 Days)',
                'slug' => 'luxor-to-aswan-nile-cruise-4n-5d',
                'summary' => 'Sail south along the Nile from Luxor to Aswan over 4 nights of 5-star comfort and riverside temples.',
                'description' => 'Embark on a timeless river voyage. Board in Luxor to explore Karnak and Luxor temples, sail past the Esna lock to the twin temple of Kom Ombo and Edfu’s falcon temple of Horus, culminating at the scenic islands of Aswan.',
                'duration' => '4 nights / 5 days',
                'price_amount' => 450.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 1,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80'
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Embarkation in Luxor & East Bank', 'details' => 'Board your cruise ship, enjoy lunch, and visit Karnak and Luxor Temples.'],
                    ['day' => 2, 'title' => 'West Bank & Sail to Edfu', 'details' => 'Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon. Sail through Esna lock.'],
                    ['day' => 3, 'title' => 'Edfu & Kom Ombo Temples', 'details' => 'Visit Horus Temple by horse carriage. Sail to Kom Ombo crocodile temple and continue to Aswan.'],
                    ['day' => 4, 'title' => 'Aswan Sightseeing', 'details' => 'Aswan High Dam, Unfinished Obelisk, and Philae Temple by boat.'],
                    ['day' => 5, 'title' => 'Disembarkation', 'details' => 'Breakfast on board, disembarkation, optional excursion to Abu Simbel.'],
                ],
                'inclusions' => ['4 nights accommodation on 5-star Nile cruise ship', 'Full board meals (Breakfast, Lunch, Dinner)', 'Guided sightseeing transfers with Egyptologist', 'All taxes and port fees'],
                'exclusions' => ['Sightseeing monument entrance fees', 'Beverages during meals', 'Optional Abu Simbel excursion', 'Staff gratuities'],
            ],
            [
                'category_id' => $cruiseCategory->id,
                'destination_id' => $destinationModels['aswan-abu-simbel']->id,
                'title' => 'Aswan to Luxor Classic Nile Cruise (3 Nights / 4 Days)',
                'slug' => 'aswan-to-luxor-nile-cruise-3n-4d',
                'summary' => 'Sail downstream from Aswan to Luxor over 3 nights of serene Nile scenery and monument discoveries.',
                'description' => 'Board in beautiful Aswan, visit the Philae sanctuary, sail downstream with the current to Kom Ombo and Edfu, and arrive in Luxor for the legendary Valley of the Kings and Karnak Temple.',
                'duration' => '3 nights / 4 days',
                'price_amount' => 380.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 2,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80'
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Embarkation in Aswan & Philae Temple', 'details' => 'Check in before lunch. Visit Aswan High Dam and Philae Temple.'],
                    ['day' => 2, 'title' => 'Kom Ombo & Edfu Temples', 'details' => 'Sail to Kom Ombo temple and Edfu. Continue sailing to Luxor.'],
                    ['day' => 3, 'title' => 'West Bank of Luxor', 'details' => 'Valley of the Kings, Hatshepsut Temple, Colossi of Memnon, and evening in Luxor.'],
                    ['day' => 4, 'title' => 'East Bank & Disembarkation', 'details' => 'Karnak and Luxor Temples, followed by final disembarkation.'],
                ],
                'inclusions' => ['3 nights cabin accommodation on 5-star ship', 'Full board meals daily', 'Guided temple visits with licensed guide'],
                'exclusions' => ['Monument admission tickets', 'Drinks & tipping'],
            ],
            [
                'category_id' => $cruiseCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'Luxor → Aswan → Luxor Complete Nile Cruise (7 Nights / 8 Days)',
                'slug' => 'luxor-aswan-luxor-complete-cruise-7n-8d',
                'summary' => 'The ultimate 7-night roundtrip Nile journey combining all Upper Egypt monuments with relaxed sailing.',
                'description' => 'The most comprehensive and peaceful way to discover the Nile. Enjoy unhurried cruising between Luxor and Aswan with generous time to unwind on the sun deck, view rural village life along the riverbanks, and explore every major archaeological marvel.',
                'duration' => '7 nights / 8 days',
                'price_amount' => 780.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 3,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80'
                ],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Luxor Arrival & Check-in', 'details' => 'Relax on board and welcome dinner.'],
                    ['day' => 2, 'title' => 'Luxor West Bank & Sail', 'details' => 'Valley of the Kings, Hatshepsut, sail to Esna.'],
                    ['day' => 3, 'title' => 'Edfu & Kom Ombo Temples', 'details' => 'Morning Edfu visit, afternoon Kom Ombo, sail to Aswan.'],
                    ['day' => 4, 'title' => 'Aswan Highlights', 'details' => 'High Dam, Philae Temple, sunset felucca ride.'],
                    ['day' => 5, 'title' => 'Abu Simbel Excursion & Sail North', 'details' => 'Optional Abu Simbel morning visit, sail back towards Kom Ombo.'],
                    ['day' => 6, 'title' => 'Scenic Nile Cruising', 'details' => 'Leisurely river sailing, Esna crossing, arrive in Luxor.'],
                    ['day' => 7, 'title' => 'Luxor East Bank (Karnak & Luxor Temples)', 'details' => 'Tour Karnak Temple and Luxor Temple illuminated at dusk.'],
                    ['day' => 8, 'title' => 'Disembarkation', 'details' => 'Breakfast and transfer to airport or hotel.'],
                ],
                'inclusions' => ['7 nights cabin stay on 5-star cruise', 'All daily meals included', 'Expert Egyptologist guide during all excursions'],
                'exclusions' => ['Monument entrance fees', 'Personal drinks & tipping'],
            ],
        ];

        foreach ($cruises as $item) {
            ServiceListing::updateOrCreate(['slug' => $item['slug']], $item);
        }

        // 6. Car Rentals & Fleet (Diverse vehicles with real vehicle images)
        $carCategory = $categoryModels['car-rentals'];
        $carOptions = [
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Mercedes-Benz E-Class Luxury Chauffeur Sedan',
                'slug' => 'mercedes-e-class-luxury-chauffeur',
                'summary' => 'VIP executive sedan with bilingual professional chauffeur, leather interior, and airport meet-and-greet.',
                'description' => 'Arrive in supreme elegance. Ideal for diplomats, executives, couples, or luxury leisure travelers. Includes iced water, phone chargers, high-speed onboard hotspot, and licensed chauffeur.',
                'rental_type' => 'car',
                'capacity' => 3,
                'price_amount' => 120.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 1,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Executive chauffeur included', 'High-speed WiFi & bottled water', 'Airport VIP terminal greeting', 'Unlimited mileage within governorate'],
                'amenities' => ['Chauffeur Included', 'Leather Seats', 'Free WiFi', 'Climate Control', 'Bottled Water'],
            ],
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Toyota HiAce High-Roof Tourist Minivan (14-Seater)',
                'slug' => 'toyota-hiace-tourist-minivan',
                'summary' => 'Spacious modern passenger van with separate luggage compartment, perfect for family groups.',
                'description' => 'The golden standard of Egyptian group travel. Equipped with dual-zone air conditioning, microphone system for guides, reclining seats, and generous luggage space.',
                'rental_type' => 'car',
                'capacity' => 12,
                'price_amount' => 95.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 2,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Seats up to 12 passengers + 12 bags', 'Powerful dual air-conditioning', 'Experienced intercity driver'],
                'amenities' => ['Chauffeur Included', '12 Passenger Capacity', 'Large Luggage Boot', 'Dual A/C'],
            ],
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'title' => 'Hyundai Tucson / Creta Modern Compact SUV',
                'slug' => 'hyundai-tucson-modern-suv',
                'summary' => 'Comfortable modern SUV with elevated seating and smooth suspension for coastal Red Sea excursions.',
                'description' => 'Ideal for small families or couples traveling between Hurghada, El Gouna, and Safaga. Available as a chauffeured service or self-drive enquiry.',
                'rental_type' => 'car',
                'capacity' => 4,
                'price_amount' => 65.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 3,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['High ground clearance', 'Generous trunk space', 'Smooth highway driving'],
                'amenities' => ['Bluetooth Audio', 'Air Conditioning', 'Full Insurance', 'Chauffeur or Self-Drive'],
            ],
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'Toyota Land Cruiser Prado 4x4 Safari & Desert SUV',
                'slug' => 'toyota-land-cruiser-prado-4x4',
                'summary' => 'Rugged luxury 4x4 vehicle capable of remote desert temple routes, oasis expeditions, and rough terrain.',
                'description' => 'Built for durability and extreme comfort in desert climates. Perfect for Luxor to Kharga/Dakhla Oasis expeditions or remote mountain tracks in the Red Sea and Sinai.',
                'rental_type' => 'car',
                'capacity' => 6,
                'price_amount' => 140.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 4,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Full-time four-wheel drive', 'Heavy-duty suspension', 'Desert expedition clearance'],
                'amenities' => ['4x4 Offroad', 'Chauffeur', 'Satellite Phone (on request)', 'Chilled Cooler Box'],
            ],
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['sharm-el-sheikh']->id,
                'title' => 'Mercedes-Benz V-Class VIP Luxury Van',
                'slug' => 'mercedes-v-class-vip-van',
                'summary' => 'First-class luxury passenger shuttle with conference seating, captain chairs, and privacy curtains.',
                'description' => 'The ultimate in private family or executive transfer comfort. Features facing leather captain chairs, fold-out tables, ambient lighting, and dedicated professional chauffeur.',
                'rental_type' => 'car',
                'capacity' => 7,
                'price_amount' => 160.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 5,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['VIP Captain Leather Seats', 'Conference table arrangement', 'High-grade privacy glass'],
                'amenities' => ['VIP Chauffeur', 'Leather Captains Chairs', 'WiFi', 'Phone Chargers'],
            ],
            [
                'category_id' => $carCategory->id,
                'destination_id' => $destinationModels['alexandria']->id,
                'title' => 'Toyota Corolla / Hyundai Elantra Economy Sedan',
                'slug' => 'toyota-corolla-economy-sedan',
                'summary' => 'Reliable, fuel-efficient private sedan with experienced driver for city errands and airport runs.',
                'description' => 'Great value private transportation with air conditioning and reliable licensed driver. Clean, comfortable, and budget-friendly for small parties.',
                'rental_type' => 'car',
                'capacity' => 3,
                'price_amount' => 45.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 6,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Direct economic pricing', 'Air-conditioned comfort', 'Airport pickup available'],
                'amenities' => ['A/C', 'Chauffeur', 'Luggage space'],
            ],
        ];

        foreach ($carOptions as $item) {
            ServiceListing::updateOrCreate(['slug' => $item['slug']], $item);
        }

        // 7. Ferry Crossings (Section 4.4: 2 Routes)
        $ferryCategory = $categoryModels['ferry-crossings'];
        $ferryRoutes = [
            [
                'category_id' => $ferryCategory->id,
                'destination_id' => $destinationModels['sharm-el-sheikh']->id,
                'title' => 'Taba ⇄ Aqaba Maritime Ferry Crossing Assistance',
                'slug' => 'taba-aqaba-ferry-crossing',
                'summary' => 'Direct maritime crossing linking Egypt\'s Sinai peninsula with Jordan\'s Red Sea port of Aqaba.',
                'description' => 'The premier maritime bridge between Egypt and Jordan. We assist international travelers with up-to-date departure scheduling, port transfer coordination, border entry guidance, and passenger enquiry support.',
                'duration' => 'Approx. 45 to 60 minutes crossing',
                'status' => 'published',
                'display_order' => 1,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Connects Egypt to Jordan (Petra gateway)', 'High-speed passenger catamarans', 'Port transfer pickup coordination'],
                'inclusions' => ['Route scheduling assistance', 'Terminal check-in advisory', 'Combined ground transfer coordination'],
                'exclusions' => ['Jordan departure taxes', 'Visa fees'],
            ],
            [
                'category_id' => $ferryCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'title' => 'Hurghada ⇄ Sharm El-Sheikh Cross-Gulf Maritime Route',
                'slug' => 'hurghada-sharm-el-sheikh-ferry',
                'summary' => 'Cross the Gulf of Suez directly by sea instead of taking the 9-hour desert road loop.',
                'description' => 'Direct marine link connecting the vibrant mainland resort of Hurghada with the Sinai coast at Sharm El-Sheikh. Enquire with our team for operating season updates, verified charter schedules, and connecting transfers.',
                'duration' => 'Approx. 2.5 hours by fast boat',
                'status' => 'published',
                'display_order' => 2,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
                'highlights' => ['Cuts transit time significantly vs road journey', 'Scenic views of the Sinai mountain coastline', 'Luggage transfer support'],
                'inclusions' => ['Service verification', 'Harbour transfer link arrangements'],
                'exclusions' => ['Port fees'],
            ],
        ];

        foreach ($ferryRoutes as $item) {
            ServiceListing::updateOrCreate(['slug' => $item['slug']], $item);
        }

        // 8. Hotels & Vacation Rentals (Expanded across multiple destinations with real resort/hotel/suite images)
        $rentalCategory = $categoryModels['vacation-rentals'];
        $rentals = [
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'title' => 'Lagoon-Front Luxury Villa in El Gouna with Private Pool',
                'slug' => 'lagoon-front-luxury-villa-el-gouna',
                'summary' => 'Stunning 4-bedroom private pool villa with direct lagoon beach access, sunset terrace, and chef kitchen.',
                'description' => 'Experience Red Sea elegance in Egypt\'s premier resort town. Features an infinity pool overlooking the turquoise lagoon, landscaped gardens, modern kitchen, and daily housekeeping options.',
                'rental_type' => 'vacation',
                'capacity' => 8,
                'bedrooms' => 4,
                'price_amount' => 320.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 1,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Private Pool', 'Lagoon Access', 'High-Speed WiFi', 'Air Conditioning', 'Full Kitchen', 'BBQ Grill', 'Security 24/7'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Direct Pyramid-View Penthouse Apartment (Giza Plateau)',
                'slug' => 'pyramid-view-penthouse-apartment-giza',
                'summary' => 'Breathtaking terrace with unobstructed panoramic views of the Great Pyramids and evening light show.',
                'description' => 'Wake up to the silhouette of the Great Pyramids right from your bedroom and private terrace. Located in a secure building minutes from the sphinx gate, equipped with luxury furnishings and modern amenities.',
                'rental_type' => 'vacation',
                'capacity' => 4,
                'bedrooms' => 2,
                'price_amount' => 150.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 2,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Private Terrace', 'Unobstructed Pyramid View', 'Smart TV', 'Fast Fiber WiFi', 'Modern Kitchen', 'Elevator'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'title' => 'Zamalek Historic Island Boutique Suite overlooking the Nile',
                'slug' => 'zamalek-island-boutique-suite-cairo',
                'summary' => 'Refined boutique apartment in Cairo\'s diplomatic district surrounded by cafes, embassies, and art galleries.',
                'description' => 'Zamalek is Cairo\'s premier leafy residential island. This renovated colonial-era suite features high ceilings, parquet floors, quiet balconies with views toward the Nile, and 24/7 doorman security.',
                'rental_type' => 'vacation',
                'capacity' => 3,
                'bedrooms' => 1,
                'price_amount' => 110.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 3,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Nile River View', 'High Speed WiFi', 'Diplomatic Area', 'Air Conditioning', 'Washer/Dryer'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['sharm-el-sheikh']->id,
                'title' => 'Sea-View Coral Beach Duplex in Naama Bay Resort',
                'slug' => 'sea-view-coral-beach-duplex-sharm',
                'summary' => 'Bright seaside 3-bedroom duplex with resort pool access and walking distance to the private beach.',
                'description' => 'A serene holiday residence overlooking the crystal waters of Naama Bay. Enjoy spacious living rooms, sun-drenched balconies, and direct access to resort amenities.',
                'rental_type' => 'vacation',
                'capacity' => 6,
                'bedrooms' => 3,
                'price_amount' => 190.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 4,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Sea View', 'Shared Pools', 'Private Beach Access', 'Air Conditioning', 'Washing Machine', 'WiFi'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'title' => 'Nile Palace Heritage Suite on Luxor West Bank',
                'slug' => 'luxor-west-bank-heritage-suite',
                'summary' => 'Tranquil traditional mudbrick-style palace with lush tropical gardens, rooftop dome, and Nile views.',
                'description' => 'Located on the quiet West Bank facing the Luxor temple illumination. Enjoy organic Egyptian breakfasts on the garden terrace, traditional domes that stay cool in summer, and immediate access to ancient Thebes.',
                'rental_type' => 'vacation',
                'capacity' => 4,
                'bedrooms' => 2,
                'price_amount' => 95.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 5,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Nile View Rooftop', 'Organic Garden', 'Breakfast Included', 'Swimming Pool', 'WiFi'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['aswan-abu-simbel']->id,
                'title' => 'Nubian Eco-Lodge & Villa on Elephantine Island',
                'slug' => 'nubian-eco-lodge-elephantine-island',
                'summary' => 'Authentic hand-painted Nubian riverfront lodge surrounded by palm groves and Nile granite rocks.',
                'description' => 'Experience genuine Nubian hospitality on Elephantine Island in Aswan. Features vaulted mudbrick architecture, private riverfront patio, traditional woven carpets, and home-cooked Nubian dinner options.',
                'rental_type' => 'vacation',
                'capacity' => 5,
                'bedrooms' => 2,
                'price_amount' => 85.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 6,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Riverfront Patio', 'Nubian Architecture', 'Air Conditioning', 'Sunset Boat Pier', 'Fresh Breakfast'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['alexandria']->id,
                'title' => 'Panoramic Mediterranean Corniche Penthouse (Alexandria)',
                'slug' => 'alexandria-corniche-panoramic-penthouse',
                'summary' => 'Top-floor sea-facing apartment overlooking Alexandria bay and the historic Qaitbay Citadel.',
                'description' => 'Bask in the Mediterranean breeze. Large floor-to-ceiling glass windows and expansive balcony with unobstructed sea views. Walking distance to historic seafood markets and cafes.',
                'rental_type' => 'vacation',
                'capacity' => 6,
                'bedrooms' => 3,
                'price_amount' => 135.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 7,
                'featured' => false,
                'main_image' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Direct Mediterranean View', 'Large Balcony', 'Elevator', 'WiFi', 'Modern Kitchen'],
            ],
            [
                'category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['marsa-alam']->id,
                'title' => 'Coral Bay Beachfront Bungalow in Marsa Alam',
                'slug' => 'coral-bay-beachfront-bungalow-marsa-alam',
                'summary' => 'Steps from untouched coral reefs and sea turtle bays in the serene southern Red Sea.',
                'description' => 'A tranquil sanctuary for lovers of nature and diving. Step directly from your wooden veranda onto soft golden sand with house reef snorkeling just 30 meters out.',
                'rental_type' => 'vacation',
                'capacity' => 2,
                'bedrooms' => 1,
                'price_amount' => 90.00,
                'price_currency' => 'USD',
                'status' => 'published',
                'display_order' => 8,
                'featured' => true,
                'main_image' => 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
                'amenities' => ['Direct Beachfront', 'House Reef Access', 'Air Conditioning', 'Stargazing Veranda'],
            ],
        ];

        foreach ($rentals as $item) {
            ServiceListing::updateOrCreate(['slug' => $item['slug']], $item);
        }

        // 9. Personal Concierge (Section 4.6: 9 Service Types with curated images)
        $conciergeCategory = $categoryModels['concierge'];
        $conciergeServices = [
            [
                'title' => 'Laundry & Professional Ironing',
                'slug' => 'concierge-laundry-ironing',
                'summary' => 'Express hotel and villa pickup, delicate fabric care, dry cleaning, and pressed return within 24 hours.',
                'description' => 'Keep your travel wardrobe fresh throughout your Egyptian vacation. We coordinate trusted local dry cleaners with door-to-door delivery right to your accommodation.',
                'display_order' => 1,
                'main_image' => 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Groceries & Beverage Provisioning',
                'slug' => 'concierge-groceries-beverages',
                'summary' => 'Pre-arrival villa stocking and on-demand delivery of imported snacks, fresh produce, and drinks.',
                'description' => 'Arrive at your apartment or yacht to find your refrigerator fully stocked with your requested essentials, fresh tropical fruits, bakery breads, and bottled waters.',
                'display_order' => 2,
                'main_image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Fast-Food & Late-Night Delivery',
                'slug' => 'concierge-fast-food-delivery',
                'summary' => 'Quick delivery from premier local and international brands delivered directly to your doorstep.',
                'description' => 'Craving late-night pizza, burgers, shawarma, or specialty sandwiches? We handle ordering, translation, address routing, and payment delivery.',
                'display_order' => 3,
                'main_image' => 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Seafood, Grilled Meats & Traditional Meals',
                'slug' => 'concierge-seafood-grilled-traditional',
                'summary' => 'Table reservations and VIP delivery from top-tier Alexandria & Red Sea seafood and grill houses.',
                'description' => 'Experience authentic Egyptian feast dining: sizzling kebab, kofta, fresh Red Sea grilled sea bass, calamari, and traditional mezze delivered hot to your dining table.',
                'display_order' => 4,
                'main_image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Home-Cooked Egyptian Meals by Private Chef',
                'slug' => 'concierge-home-cooked-egyptian-meals',
                'summary' => 'Freshly prepared familial Egyptian dishes like Molokhia, stuffed pigeon, Koshari, and Mahshi.',
                'description' => 'Savor the authentic taste of Egyptian grandmothers’ cooking. A vetted local chef will prepare an exquisite, warm traditional dinner served directly in your villa.',
                'display_order' => 5,
                'main_image' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Oriental Sweets & Artisan Desserts',
                'slug' => 'concierge-oriental-sweets-desserts',
                'summary' => 'Handpicked gift boxes of fresh Kunafa, Basbousa, Baklava, and Om Ali from historic Egyptian patisseries.',
                'description' => 'Gift yourself or loved ones the finest Syrian and Egyptian confections from century-old confectionery shops in Cairo and Alexandria.',
                'display_order' => 6,
                'main_image' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Souvenirs & Egyptian Cotton Products',
                'slug' => 'concierge-souvenirs-egyptian-cotton',
                'summary' => 'Certified long-staple Egyptian cotton towels, bedsheets, custom galabeyas, and alabaster crafts.',
                'description' => 'Avoid tourist traps and overpriced souvenir stalls. Our concierge procures authenticated 100% genuine Egyptian cotton linens and artisan crafts directly from trusted workshops.',
                'display_order' => 7,
                'main_image' => 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Jewellery & Gold Shopping Assistance',
                'slug' => 'concierge-jewellery-shopping-assistance',
                'summary' => 'Personal local escort to the gold souks and silversmiths with hallmarking and fair weight verification.',
                'description' => 'Shop for gold cartouches, lotus pendants, and silver filigree in Cairo\'s historic gold quarter with a trusted bilingual representative to protect against overpricing.',
                'display_order' => 8,
                'main_image' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Custom Guest Requests & Emergency Support',
                'slug' => 'concierge-custom-guest-requests',
                'summary' => 'Pharmacy deliveries, SIM card setups, lost luggage assistance, medical coordination, and bespoke errands.',
                'description' => 'Whatever you need during your stay in Egypt, our local multilingual concierge team is just a WhatsApp message away to resolve your requests smoothly.',
                'display_order' => 9,
                'main_image' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($conciergeServices as $item) {
            ServiceListing::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'category_id' => $conciergeCategory->id,
                    'status' => 'published',
                    'featured' => false,
                ])
            );
        }

        // 10. Event Planning (Section 4.7: 6 Offerings with vivid photos)
        $eventsCategory = $categoryModels['events'];
        $eventOfferings = [
            [
                'title' => 'Birthday Celebrations & Private Parties',
                'slug' => 'event-birthday-celebrations',
                'summary' => 'Custom decoration, theme cakes, live acoustic entertainment, and venue coordination.',
                'description' => 'Celebrate a milestone birthday under the Egyptian stars. We design personalized setups with customized themes, gourmet catering, professional photography, and musical entertainment.',
                'display_order' => 1,
                'main_image' => 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Valentine\'s Day & Romantic Anniversaries',
                'slug' => 'event-valentines-anniversaries',
                'summary' => 'Candlelit dining, red rose setups, private violinists, and bespoke romantic itineraries.',
                'description' => 'Create an enchanting anniversary surprise for your partner. From private beach candlelit dinners to flower-filled cruise suites, we craft unforgettable memories.',
                'display_order' => 2,
                'main_image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Custom Private & Family Events',
                'slug' => 'event-custom-private-gatherings',
                'summary' => 'Intimate family reunions, corporate retreat dinners, and bespoke gathering management.',
                'description' => 'Coordinating private group dinners, VIP transport, sound systems, and dedicated event coordinators for medium and large family or private groups.',
                'display_order' => 3,
                'main_image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Private Nile Cruise Event Arrangements',
                'slug' => 'event-private-nile-cruise-arrangements',
                'summary' => 'Chartered evening dahabiyas and private boats with oriental buffet and Tanoura dance show.',
                'description' => 'Host your event cruising along the illuminated Cairo or Luxor Nile skyline. Includes custom catering, lighting, open-deck reception, and cultural live shows.',
                'display_order' => 4,
                'main_image' => 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Pyramid-View Venue & Dinner Arrangements',
                'slug' => 'event-pyramid-view-venue-arrangements',
                'summary' => 'Exclusive rooftop reservations overlooking the illuminated Pyramids of Giza.',
                'description' => 'Nothing rivals dining before the great ancient pyramids. We reserve prime vantage points, arrange bespoke five-course dinners, and handle all guest transfers.',
                'display_order' => 5,
                'main_image' => 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Restaurant & Boutique Café Gatherings',
                'slug' => 'event-restaurant-boutique-cafe-gatherings',
                'summary' => 'Priority bookings, tailored menus, and secluded areas in Egypt\'s trendiest dining destinations.',
                'description' => 'Access exclusive spots in Zamalek, New Cairo, Alexandria Corniche, and El Gouna marinas with pre-set chef menus and private lounge areas.',
                'display_order' => 6,
                'main_image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($eventOfferings as $item) {
            ServiceListing::updateOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'category_id' => $eventsCategory->id,
                    'status' => 'published',
                    'featured' => false,
                ])
            );
        }

        // 11. Realistic Sample Enquiries across multiple categories
        $sampleEnquiries = [
            [
                'reference' => 'WT-2026-000101',
                'customer_name' => 'Sarah Jenkins',
                'email' => 'sarah.jenkins@example.com',
                'phone' => '+44 7700 900123',
                'service_category_id' => $excursionCategory->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'message' => 'We are a party of 4 arriving in Cairo on November 12th. We would love a private guided tour of the Giza Pyramids and the new Grand Egyptian Museum with hotel pickup.',
                'preferences' => ['party_size' => 4, 'preferred_date' => '2026-11-12', 'guide_language' => 'English'],
                'status' => 'new',
            ],
            [
                'reference' => 'WT-2026-000102',
                'customer_name' => 'Marc Dupont',
                'email' => 'm.dupont@example.fr',
                'phone' => '+33 6 12 34 56 78',
                'service_category_id' => $cruiseCategory->id,
                'destination_id' => $destinationModels['luxor']->id,
                'message' => 'Interested in the 4 nights Luxor to Aswan cruise for our anniversary in December. Can you provide cabin rates and availability on a 5-star ship?',
                'preferences' => ['itinerary' => 'Luxor to Aswan', 'cabin_type' => 'Upper deck suite', 'travel_month' => 'December 2026'],
                'status' => 'in_progress',
            ],
            [
                'reference' => 'WT-2026-000103',
                'customer_name' => 'Oliver Schmidt',
                'email' => 'oliver.schmidt@example.de',
                'phone' => '+49 170 1234567',
                'service_category_id' => $carCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'message' => 'Need a chauffeured private minivan for 6 passengers from Hurghada Airport to El Gouna and daily local trips.',
                'preferences' => ['passengers' => 6, 'vehicle' => 'Minivan with driver', 'duration_days' => 5],
                'status' => 'responded',
            ],
            [
                'reference' => 'WT-2026-000104',
                'customer_name' => 'Elena Rossi',
                'email' => 'elena.rossi@example.it',
                'phone' => '+39 340 1234567',
                'service_category_id' => $rentalCategory->id,
                'destination_id' => $destinationModels['hurghada']->id,
                'message' => 'Checking availability for the lagoon-front luxury villa in El Gouna for 7 days in January.',
                'preferences' => ['capacity' => 6, 'dates' => 'Jan 15 - Jan 22'],
                'status' => 'closed',
            ],
            [
                'reference' => 'WT-2026-000105',
                'customer_name' => 'Alexander Wright',
                'email' => 'alex.wright@example.co.uk',
                'phone' => '+44 7911 123456',
                'service_category_id' => $categoryModels['events']->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'message' => 'I would like to plan a surprise rooftop marriage proposal overlooking the Pyramids at sunset with acoustic violin and private photographer.',
                'preferences' => ['event_type' => 'Pyramid-View Dinner & Proposal', 'guests' => 2, 'preferred_date' => '2026-12-24'],
                'status' => 'in_progress',
            ],
            [
                'reference' => 'WT-2026-000106',
                'customer_name' => 'Nathalie Vane',
                'email' => 'nathalie.vane@example.ca',
                'phone' => '+1 416 555 0192',
                'service_category_id' => $categoryModels['concierge']->id,
                'destination_id' => $destinationModels['cairo-giza']->id,
                'message' => 'Staying at an apartment in Zamalek for 2 weeks. Need grocery pre-stocking on arrival and laundry service twice a week.',
                'preferences' => ['service' => 'Groceries & Laundry Care'],
                'status' => 'new',
            ],
        ];

        foreach ($sampleEnquiries as $enqData) {
            $enquiry = Enquiry::updateOrCreate(['reference' => $enqData['reference']], $enqData);
            if ($enquiry->status === 'in_progress') {
                EnquiryNote::firstOrCreate(
                    ['enquiry_id' => $enquiry->id, 'note' => 'Contacted customer on WhatsApp. Checking available dates with coordinator.'],
                    ['user_id' => $admin->id]
                );
            }
        }

        // 12. Website Settings
        $settings = [
            'company_name' => 'WeCheaperTours',
            'tagline' => 'Explore Egypt’s Wonders with Trusted Local Experts',
            'whatsapp_number' => '+201012345678',
            'phone' => '+20 10 1234 5678',
            'email' => 'info@wecheapertours.com',
            'address' => 'Tahrir Square, Downtown, Cairo, Egypt',
            'facebook_url' => 'https://facebook.com/wecheapertours',
            'instagram_url' => 'https://instagram.com/wecheapertours',
            'currency' => 'USD',
            'enquiry_disclaimer' => 'Important: Car rentals, ferry crossings, vacation rentals, concierge services, and event planning are informational and enquiry-based. Submitting an enquiry does not constitute a confirmed booking. Our travel coordinators confirm all details directly with you.',
            'about_story' => 'WeCheaperTours was born out of a passion to share the profound heritage, timeless beauty, and warm hospitality of Egypt at honest, direct rates. We connect curious world travelers directly with licensed Egyptologists, vetted drivers, and authentic local services.',
        ];

        foreach ($settings as $key => $value) {
            WebsiteSetting::set($key, $value);
        }
    }
}
