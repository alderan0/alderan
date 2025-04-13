ts
import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedDatabase() {
  try {
    // Generate and insert fake user profiles
    const users = []
    for (let i = 0; i < 10; i++) {
      const email = faker.internet.email()
      const password = faker.internet.password()

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError || !authData.user) {
        console.error('Error creating user:', authError)
        continue
      }

      const userId = authData.user.id
      users.push(userId)

      // Insert user profile into public.profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: faker.internet.userName(),
          full_name: faker.person.fullName(),
          avatar_url: faker.image.avatar(),
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      } else {
        console.log(`Created user and profile for ${email}`)
      }
    }

    // Generate and insert fake projects, tasks, and habits for each user
    for (const userId of users) {
      // Create projects
      for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert({
            user_id: userId,
            title: faker.commerce.productName(),
            description: faker.lorem.paragraph(),
            // Add other project fields as needed
          })
          .select()
          .single()

        if (projectError) {
          console.error('Error creating project:', projectError)
          continue
        }

        const projectId = project.id

        // Create tasks for the project
        for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
          const { error: taskError } = await supabase.from('tasks').insert({
            project_id: projectId,
            user_id: userId,
            title: faker.hacker.phrase(),
            description: faker.lorem.sentence(),
            is_completed: faker.datatype.boolean(),
            // Add other task fields as needed
          })

          if (taskError) {
            console.error('Error creating task:', taskError)
          }
        }
      }

      // Create habits
      for (let i = 0; i < faker.number.int({ min: 2, max: 4 }); i++) {
        const { error: habitError } = await supabase.from('habits').insert({
          user_id: userId,
          name: faker.word.noun() + ' coding', // Vibe coding related habit
          frequency: faker.helpers.arrayElement(['daily', 'weekly']),
          // Add other habit fields as needed
        })

        if (habitError) {
          console.error('Error creating habit:', habitError)
        }
      }
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seedDatabase()