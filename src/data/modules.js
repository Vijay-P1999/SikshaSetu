// Learning modules based on NEP 2020 guidelines for different grades
export const learningModules = {
    1: [
        {
            id: 'g1-m1',
            title: 'Numbers 1-10',
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Beginner',
            content: `Let's learn numbers from 1 to 10! 
      
1️⃣ One - एक
2️⃣ Two - दो  
3️⃣ Three - तीन
4️⃣ Four - चार
5️⃣ Five - पाँच
6️⃣ Six - छह
7️⃣ Seven - सात
8️⃣ Eight - आठ
9️⃣ Nine - नौ
🔟 Ten - दस

Practice counting objects around you!`,
            videoUrl: null
        },
        {
            id: 'g1-m2',
            title: 'Alphabets A-Z',
            subject: 'English',
            type: 'text',
            difficulty: 'Beginner',
            content: `Let's learn the English alphabet!

🅰️ A for Apple 🍎
🅱️ B for Ball ⚽
🅲 C for Cat 🐱
🅳 D for Dog 🐕

Practice writing each letter!`,
            videoUrl: null
        }
    ],
    2: [
        {
            id: 'g2-m1',
            title: 'Addition & Subtraction',
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Beginner',
            content: `Addition means putting things together!
      
Example: 🍎🍎 + 🍎🍎🍎 = 5 apples

Subtraction means taking away!

Example: 🍎🍎🍎🍎🍎 - 🍎🍎 = 3 apples left`,
            videoUrl: null
        }
    ],
    3: [
        {
            id: 'g3-m1',
            title: 'Multiplication Tables',
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Intermediate',
            content: `Multiplication is repeated addition!

2 × 3 = 2 + 2 + 2 = 6
3 × 4 = 3 + 3 + 3 + 3 = 12

Let's learn the 2 times table:
2 × 1 = 2
2 × 2 = 4
2 × 3 = 6
2 × 4 = 8
2 × 5 = 10`,
            videoUrl: null
        }
    ],
    4: [
        {
            id: 'g4-m1',
            title: 'Fractions Basics',
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Intermediate',
            content: `A fraction represents a part of a whole.

1/2 means one part out of two equal parts (half)
1/4 means one part out of four equal parts (quarter)

Example: If you cut a pizza into 4 equal slices and eat 1 slice, you ate 1/4 of the pizza!`,
            videoUrl: null
        }
    ],
    5: [
        {
            id: 'g5-m1',
            title: 'Decimals and Place Value',
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Intermediate',
            content: `Decimals are another way to represent fractions.

The decimal point separates whole numbers from parts of numbers.

Example: 3.5 = 3 + 5/10 = 3 and a half

Place values:
- Ones place: 3
- Decimal point: .
- Tenths place: 5`,
            videoUrl: null
        }
    ]
};

// Add more grades as needed
for (let grade = 6; grade <= 10; grade++) {
    learningModules[grade] = [
        {
            id: `g${grade}-m1`,
            title: `Grade ${grade} Mathematics`,
            subject: 'Mathematics',
            type: 'text',
            difficulty: 'Advanced',
            content: `Advanced mathematics concepts for Grade ${grade} students.`,
            videoUrl: null
        }
    ];
}
