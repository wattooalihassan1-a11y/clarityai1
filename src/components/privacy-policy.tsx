"use client";

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PrivacyPolicy() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-full">Privacy Policy</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Privacy Policy</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 mt-4 -mx-6">
          <div className="px-6 prose prose-sm dark:prose-invert max-w-none">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p>
                Thank you for using Clarity AI, an intelligent AI assistant developed by NextGenDeveloper Ali Hassan.
                Your privacy is important to us, and this policy explains how your data is collected, used, and protected in accordance with <strong>Google Play Developer Policies, GDPR, and global privacy standards</strong>.
            </p>
            
            <h3>1. Information We Collect</h3>
            <h4>1.1 User-Provided Data</h4>
            <p>We may collect the following information when you interact with our app:</p>
            <ul>
                <li><strong>Text you type</strong> in the chat</li>
                <li><strong>Uploaded images</strong> (only when you choose to send them)</li>
                <li><strong>Voice input</strong> (converted into text inside the app)</li>
                <li>Feedback and support messages</li>
            </ul>

            <h4>1.2 Automatically Collected Data</h4>
            <p>To improve performance and security, the app may collect:</p>
            <ul>
                <li><strong>Device information</strong> (device model, OS version)</li>
                <li><strong>Log data</strong> (crash reports, app performance)</li>
                <li><strong>Usage statistics</strong> (feature usage, interactions)</li>
            </ul>

            <h4>1.3 No Sensitive or Personal Identity Data</h4>
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
            
            <h3>2. How We Use Your Information</h3>
            <p>Your data is used only for:</p>
            <ul>
                <li>Generating AI responses</li>
                <li>Improving accuracy and quality of answers</li>
                <li>Fixing bugs and enhancing app performance</li>
                <li>Keeping the app secure and stable</li>
            </ul>
            <p>We <strong>do NOT sell or share</strong> your data with any third party for advertising or marketing.</p>
            
            <h3>3. Data Storage & Security</h3>
            <ul>
                <li>All chat data is stored <strong>locally on your device</strong>, unless you choose to clear it.</li>
                <li><strong>No personal data is stored on our servers</strong>.</li>
                <li>AI message processing is handled through <strong>secure APIs</strong> such as Google Gemini, OpenAI, or other providers you select.</li>
                <li><strong>Industry-standard encryption</strong> is used to protect communication.</li>
            </ul>
            
            <h3>4. Third-Party Services</h3>
            <p>Clarity AI may use third-party APIs for:</p>
            <ul>
                <li>AI responses</li>
                <li>Voice-to-text</li>
                <li>Crash analytics</li>
            </ul>
            <p>These services follow their own privacy policies. Common providers include:</p>
            <ul>
                <li>Google Gemini / AI APIs</li>
                <li>Firebase Crashlytics</li>
                <li>OpenAI (if selected)</li>
            </ul>
            <p>We do not allow any third party to access your <strong>personal identity</strong>.</p>

            <h3>5. Children’s Privacy</h3>
            <p>Clarity AI is <strong>not intended for children under 13</strong>.</p>
            <p>We do not knowingly collect data from children.</p>

            <h3>6. Your Rights</h3>
            <p>You have the right to:</p>
            <ul>
                <li><strong>Delete your chat history</strong> anytime inside the app</li>
                <li>Request deletion of any stored data</li>
                <li>Disable permissions like microphone or storage</li>
                <li>Stop using the app at any time</li>
            </ul>

            <h3>7. Changes to This Privacy Policy</h3>
            <p>We may update this policy occasionally.</p>
            <p>Changes will be posted within the app, and the “Last Updated” date will be revised.</p>

            <h3>8. Contact Us</h3>
            <p>If you have any questions or concerns:</p>
            <p>Developer: NextGenDeveloper Ali Hassan</p>
            <p>Email: <a href="mailto:nextgendeveloperalihassan@gmail.com" className="text-primary underline">nextgendeveloperalihassan@gmail.com</a></p>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
