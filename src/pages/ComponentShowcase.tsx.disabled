import React from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardBody, Button, Input } from '../components/ui';

const ShowcaseContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ComponentShowcase = () => {
  return (
    <ShowcaseContainer>
      <h1>Component Showcase</h1>
      <p>This page showcases all UI components used in the application.</p>
      
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <ComponentRow>
          <Button>Default Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button disabled>Disabled Button</Button>
        </ComponentRow>
        
        <ComponentRow>
          <Button size="small">Small Button</Button>
          <Button>Regular Button</Button>
          <Button size="large">Large Button</Button>
        </ComponentRow>
        
        <ComponentRow>
          <Button fullWidth>Full Width Button</Button>
        </ComponentRow>
      </Section>
      
      <Section>
        <SectionTitle>Cards</SectionTitle>
        <ComponentRow>
        <Card>
            <CardBody>
              <h3>Basic Card</h3>
              <p>This is a basic card with just a body.</p>
            </CardBody>
          </Card>
          
          {/* FIX: Use 'elevation' for shadows */}
          <Card elevation="high">
            <CardHeader>Elevated Card</CardHeader>
            <CardBody>
              <p>This card has a strong shadow.</p>
            </CardBody>
          </Card>
          
          {/* FIX: The 'variant' prop will now work correctly */}
          <Card variant="outlined">
            <CardHeader>Outlined Card</CardHeader>
            <CardBody>
              <p>This is an outlined card variant.</p>
            </CardBody>
          </Card>
        </ComponentRow>
      </Section>
      
      <Section>
        <SectionTitle>Form Elements</SectionTitle>
        <ComponentRow>
          <div style={{ width: '300px' }}>
            <Input placeholder="Standard Input" />
          </div>
          
          <div style={{ width: '300px' }}>
            <Input placeholder="Disabled Input" disabled />
          </div>
        </ComponentRow>
        
        <ComponentRow>
          <div style={{ width: '300px' }}>
            <Input placeholder="With Label" label="Username" />
          </div>
          
          <div style={{ width: '300px' }}>
            <Input 
              placeholder="With Helper Text" 
              label="Password" 
              type="password"
              helperText="Password must be at least 8 characters"
            />
          </div>
        </ComponentRow>
        
        <ComponentRow>
          <div style={{ width: '300px' }}>
            <Input 
              placeholder="With Helper Text" 
              label="Password" 
              type="password"
              helperText="Password must be at least 8 characters"
            />
          </div>
          <div style={{ width: '300px' }}>
            {/* FIX: 'error' prop now correctly accepts a string */}
            <Input 
              placeholder="Error State" 
              label="Email" 
              error
              errorText="Please enter a valid email address"
            />
          </div>
          
          <div style={{ width: '300px' }}>
            {/* FIX: Use 'success' as a boolean prop */}
            <Input 
              placeholder="Success State" 
              label="Verification Code"
              success
            />
          </div>
        </ComponentRow>
      </Section>
    </ShowcaseContainer>
  );
};

export default ComponentShowcase;