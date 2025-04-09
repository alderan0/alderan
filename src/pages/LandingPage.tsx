
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  ChevronDown,
  Leaf, 
  Calendar, 
  Users, 
  Globe,
  Heart,
  TreePine,
  Medal,
  MessageSquare,
  Mail
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-alderan-green-dark to-alderan-green-light py-20 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-float">
              Grow Your Impact, One Task at a Time
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Alderan turns your eco-friendly habits into a virtual tree that grows with every sustainable action you take.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-white text-alderan-green-dark hover:bg-white/90">
                <Link to="/auth" className="flex items-center gap-2">
                  Get Started <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-64 md:h-96 relative">
              <div className="absolute inset-0 bg-[url('/lovable-uploads/e14b38a8-ba30-4f3a-9853-8b7ec0bb6fc7.png')] bg-contain bg-center bg-no-repeat animate-bounce-slow opacity-90"></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-alderan-leaf rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Why The Need For Alderan - Problem Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why We Need Alderan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-card to-muted/50 shadow-lg border-none">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-full bg-alderan-green-light/20 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-alderan-green-dark" />
                </div>
                <h3 className="text-xl font-semibold">Disconnection from Nature</h3>
                <p className="text-muted-foreground">
                  In our digital world, we've lost our connection with the natural environment, making sustainable habits harder to maintain.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-muted/50 shadow-lg border-none">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-full bg-alderan-blue/20 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-alderan-blue" />
                </div>
                <h3 className="text-xl font-semibold">Low Motivation</h3>
                <p className="text-muted-foreground">
                  Without immediate rewards, staying committed to environmentally friendly habits becomes challenging over time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-muted/50 shadow-lg border-none">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-full bg-alderan-leaf/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-alderan-leaf" />
                </div>
                <h3 className="text-xl font-semibold">Lack of Community</h3>
                <p className="text-muted-foreground">
                  Individual efforts often feel insignificant without a supportive community to share and celebrate environmental achievements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Alderan - Solution Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-muted to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Alderan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your digital companion for nurturing sustainable habits and reconnecting with nature
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-alderan-green-light/20 p-2 rounded-full">
                    <Leaf className="h-6 w-6 text-alderan-green-light" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Virtual Tree Growth</h3>
                    <p className="text-muted-foreground mt-2">
                      Watch your virtual tree grow and flourish with each sustainable action you complete.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-alderan-blue/20 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-alderan-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Daily Eco Challenges</h3>
                    <p className="text-muted-foreground mt-2">
                      Complete personalized sustainability tasks designed to fit seamlessly into your daily routine.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-alderan-leaf/20 p-2 rounded-full">
                    <Users className="h-6 w-6 text-alderan-leaf" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Community Engagement</h3>
                    <p className="text-muted-foreground mt-2">
                      Connect with like-minded individuals, share achievements, and inspire others in your sustainability journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="relative h-80 w-full">
                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-xl">
                  <div className="h-full w-full bg-[url('/tree-screenshot.jpg')] bg-cover bg-center animate-float">
                    <div className="absolute inset-0 bg-gradient-to-tr from-alderan-green-dark/40 to-transparent"></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-40 w-40 bg-alderan-leaf rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us - Benefits Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Alderan</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mb-4 text-alderan-green-dark">
                <TreePine size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visualize Your Impact</h3>
              <p className="text-muted-foreground">
                See the tangible results of your sustainable habits through your growing virtual tree.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mb-4 text-alderan-blue">
                <Medal size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gamified Sustainability</h3>
              <p className="text-muted-foreground">
                Earn rewards, unlock achievements, and stay motivated through playful, engaging interactions.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mb-4 text-alderan-leaf">
                <Users size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Supportive Community</h3>
              <p className="text-muted-foreground">
                Join a network of environmentally conscious individuals who encourage and inspire each other.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="mb-4 text-alderan-green-light">
                <Heart size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Healthy Habit Building</h3>
              <p className="text-muted-foreground">
                Develop lasting sustainable routines through consistent, meaningful actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Alderan Works</h2>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-alderan-green-light/30 -translate-x-1/2"></div>
            
            <div className="space-y-16">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-card p-8 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-semibold mb-4">1. Create Your Account</h3>
                    <p className="text-muted-foreground">
                      Sign up and customize your profile to begin your sustainable journey with Alderan.
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-alderan-green-dark flex items-center justify-center text-white text-2xl font-bold relative z-10">
                    1
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2">
                  <div className="bg-card p-8 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-semibold mb-4">2. Complete Eco Tasks</h3>
                    <p className="text-muted-foreground">
                      Choose from daily tasks designed to promote sustainability in your everyday life.
                    </p>
                  </div>
                </div>
                <div className="order-1 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-alderan-green-dark flex items-center justify-center text-white text-2xl font-bold relative z-10">
                    2
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-card p-8 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-semibold mb-4">3. Watch Your Tree Grow</h3>
                    <p className="text-muted-foreground">
                      With each completed task, your virtual tree grows and flourishes, visually representing your impact.
                    </p>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-alderan-green-dark flex items-center justify-center text-white text-2xl font-bold relative z-10">
                    3
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2">
                  <div className="bg-card p-8 rounded-xl shadow-sm">
                    <h3 className="text-2xl font-semibold mb-4">4. Engage with the Community</h3>
                    <p className="text-muted-foreground">
                      Share your achievements, participate in challenges, and celebrate collective wins with like-minded individuals.
                    </p>
                  </div>
                </div>
                <div className="order-1 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-alderan-green-dark flex items-center justify-center text-white text-2xl font-bold relative z-10">
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg">
                What is Alderan and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Alderan is a sustainability app that helps you build eco-friendly habits. Complete daily tasks to grow your virtual tree and connect with a community of environmentally conscious individuals.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg">
                Is Alderan free to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Alderan offers a free tier with all essential features. For enhanced features and experiences, we offer premium subscription options.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg">
                How are the eco tasks selected?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tasks are carefully curated to promote sustainable living practices. As you use the app more, it personalizes tasks based on your habits, preferences, and environmental impact goals.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg">
                Can I interact with other users?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely! Alderan has a thriving community where you can share your achievements, participate in group challenges, and vote on the most beautiful trees.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg">
                What happens if I miss completing tasks?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No worries! Your tree won't die if you miss tasks. Our goal is to encourage consistent habits, not create stress. You can always pick up where you left off.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-muted to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your sustainability journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card shadow-sm border-border">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-2 uppercase text-sm font-semibold">Free</p>
                  <h3 className="text-4xl font-bold mb-2">$0</h3>
                  <p className="text-muted-foreground">Forever free</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Virtual tree growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Basic sustainability tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Community access</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-xl border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-alderan-green-light text-white text-xs font-bold py-1 px-3 rounded-full">
                MOST POPULAR
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-2 uppercase text-sm font-semibold">Premium</p>
                  <h3 className="text-4xl font-bold mb-2">$4.99</h3>
                  <p className="text-muted-foreground">per month</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Everything in Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Advanced tree customization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Personalized task recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Detailed impact analytics</span>
                  </div>
                </div>
                
                <Button className="w-full bg-alderan-green-dark hover:bg-alderan-green-dark/90">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-sm border-border">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-2 uppercase text-sm font-semibold">Team</p>
                  <h3 className="text-4xl font-bold mb-2">$12.99</h3>
                  <p className="text-muted-foreground">per month</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Everything in Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Group challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Team leaderboards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-alderan-green-light" />
                    <span>Collaborative forest creation</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Need a custom solution for your organization?
            </p>
            <Button variant="secondary" size="lg">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Have questions about Alderan or need support? Our team is here to help!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-alderan-green-light/20 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-alderan-green-dark" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <a href="mailto:hello@alderan.eco" className="text-alderan-green-light hover:underline">
                hello@alderan.eco
              </a>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-alderan-green-light/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-alderan-green-dark" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-muted-foreground">Available 9am - 5pm PST</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-alderan-green-light/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-alderan-green-dark" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Social Media</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          
          <Button size="lg" className="bg-alderan-green-dark hover:bg-alderan-green-dark/90">
            Contact Us
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-6 md:px-12 lg:px-24 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-lg mb-4">Alderan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">LinkedIn</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/e14b38a8-ba30-4f3a-9853-8b7ec0bb6fc7.png" 
                alt="Alderan Logo" 
                className="h-8 w-8" 
              />
              <span className="font-semibold text-lg">Alderan</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Alderan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
