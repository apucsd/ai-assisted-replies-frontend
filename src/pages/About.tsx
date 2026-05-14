import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaShieldAlt, FaUserShield, FaBrain } from 'react-icons/fa'

export default function About() {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <Card className="shadow-2xl border-none p-6 bg-card transition-all">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About AI Safe Message</CardTitle>
          <p className="text-xl text-muted-foreground mt-2">
            Protecting your digital presence with state-of-the-art AI content moderation.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50">
              <FaShieldAlt className="text-4xl text-instagram-blue mb-3" />
              <span className="font-bold">Secure</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50">
              <FaBrain className="text-4xl text-instagram-pink mb-3" />
              <span className="font-bold">Smart</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50">
              <FaUserShield className="text-4xl text-instagram-orange mb-3" />
              <span className="font-bold">Private</span>
            </div>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our platform uses advanced NLP models to scan and rewrite potentially harmful or sensitive messages into professional, platform-compliant text.
            </p>
            <p>
              Whether you're communicating in a professional setting or just want to ensure your messages meet safety standards, our AI provides an instant safety net.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
