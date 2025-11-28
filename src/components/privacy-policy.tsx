"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-full">Privacy Policy</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-full h-full max-h-full flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="px-6 pb-6 prose prose-sm dark:prose-invert max-w-none">
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p>
                  Thank you for using <strong>Clarity AI</strong>, an intelligent AI assistant developed by <strong>NextGenDeveloper Ali Hassan</strong>.
                  Your privacy is important to us, and this policy explains how your data is collected, used, and protected in accordance with <strong>Google Play Developer Policies, GDPR, and global privacy standards</strong>.
              </p>
              
              <h3><strong>1. Information We Collect</strong></h3>
              <h4><strong>1.1 User-Provided Data</strong></h4>
              <p>We may collect the following information when you interact with our app:</p>
              <ul>
                  <li><strong>Text you type</strong> in the chat</li>
                  <li><strong>Uploaded images</strong> (only when you choose to send them)</li>
                  <li><strong>Voice input</strong> (converted into text inside the app)</li>
                  <li>Feedback and support messages</li>
              </ul>

              <h4><strong>1.2 Automatically Collected Data</strong></h4>
              <p>To improve performance and security, the app may collect:</p>
              <ul>
                  <li><strong>Device information</strong> (device model, OS version)</li>
                  <li><strong>Log data</strong> (crash reports, app performance)</li>
                  <li><strong>Usage statistics</strong> (feature usage, interactions)</li>
              </ul>

              <h4><strong>1.3 No Sensitive or Personal Identity Data</strong></h4>
              <p>We <strong>do not collect</strong>:</p>
              <ul>
                  <li>Phone number</li>
                  <li>Contacts</li>
                  <li>Photos/media (unless you manually upload)</li>
                  <li>Location data</li>
                  <li>Financial information</li>
                  <li>Government IDs</li>
              </ul>
              <p>Your identity always remains <strong>anonymous</strong>.</p>
              
              <h3><strong>2. How We Use Your Information</strong></h3>
              <p>Your data is used only for:</p>
              <ul>
                  <li>Generating <strong>AI responses</strong></li>
                  <li>Improving accuracy and quality of answers</li>
                  <li>Fixing bugs and enhancing app performance</li>
                  <li>Keeping the app <strong>secure and stable</strong></li>
              </ul>
              <p>We <strong>do NOT sell or share</strong> your data with any third party for advertising or marketing.</p>
              
              <h3><strong>3. Data Storage & Security</strong></h3>
              <ul>
                  <li>All chat data is stored <strong>locally on your device</strong>, unless you choose to clear it.</li>
                  <li><strong>No personal data is stored on our servers</strong>.</li>
                  <li>AI message processing is handled through <strong>secure APIs</strong> such as Google Gemini, OpenAI, or other providers you select.</li>
                  <li><strong>Industry-standard encryption</strong> is used to protect communication.</li>
              </ul>
              
              <h3><strong>4. Third-Party Services</strong></h3>
              <p>Clarity AI may use third-party APIs for:</p>
              <ul>
                  <li><strong>AI responses</strong></li>
                  <li><strong>Voice-to-text</strong></li>
                  <li><strong>Crash analytics</strong></li>
              </ul>
              <p>These services follow their own privacy policies. Common providers include:</p>
              <ul>
                  <li>Google Gemini / AI APIs</li>
                  <li>Firebase Crashlytics</li>
                  <li>OpenAI (if selected)</li>
              </ul>
              <p>We do not allow any third party to access your <strong>personal identity</strong>.</p>

              <h3><strong>5. Children’s Privacy</strong></h3>
              <p>Clarity AI is <strong>not intended for children under 13</strong>.</p>
              <p>We do not knowingly collect data from children.</p>

              <h3><strong>6. Your Rights</strong></h3>
              <p>You have the right to:</p>
              <ul>
                  <li><strong>Delete your chat history</strong> anytime inside the app</li>
                  <li>Request deletion of any stored data</li>
                  <li>Disable permissions like microphone or storage</li>
                  <li>Stop using the app at any time</li>
              </ul>

              <h3><strong>7. Changes to This Privacy Policy</strong></h3>
              <p>We may update this policy occasionally.</p>
              <p>Changes will be posted within the app, and the “Last Updated” date will be revised.</p>

              <h3><strong>8. Contact Us</strong></h3>
              <p>If you have any questions or concerns:</p>
              <p><strong>Developer:</strong> NextGenDeveloper Ali Hassan</p>
              <p><strong>Email:</strong> <a href="mailto:nextgendeveloperalihassan@gmail.com" className="text-primary underline">nextgendeveloperalihassan@gmail.com</a></p>
            </div>
          </ScrollArea>
        </div>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
