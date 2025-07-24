/**
 * Radix Themes Demo Component
 *
 * This component demonstrates the Radix Themes integration and showcases
 * various components and design patterns available in the design system.
 *
 * Features:
 * - Demonstrates Radix Themes components
 * - Shows responsive design patterns
 * - Includes accessibility features
 * - Provides interactive examples
 * - Integrates with existing design tokens
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  TextField,
  Select,
  Switch,
  Checkbox,
  RadioGroup,
  Tabs,
  Dialog,
  DropdownMenu,
  Callout,
  Separator,
  Avatar,
  Progress,
  Spinner,
  AlertDialog,
} from '@radix-ui/themes';
import {
  InfoCircledIcon,
  CheckIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  PersonIcon,
  GearIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { ThemeToggle } from '../providers/RadixThemeProvider';

type FC<T = {}> = React.FC<T>;

export const RadixThemeDemo: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [progressValue, setProgressValue] = useState(0);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState<boolean | 'indeterminate'>(
    false
  );
  const [radioValue, setRadioValue] = useState('option-1');
  const [textValue, setTextValue] = useState('');
  const [selectValue, setSelectValue] = useState('option-1');

  // Progress simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue(prev => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container size="4" mx="auto" py="6">
      <Section>
        <Flex direction="column" gap="6">
          {/* Header */}
          <Flex justify="between" align="center">
            <Box>
              <Heading size="8" mb="2">
                Radix Themes Demo
              </Heading>
              <Text size="4" color="gray">
                Showcasing the integrated design system components
              </Text>
            </Box>
            <ThemeToggle />
          </Flex>

          {/* Status Cards */}
          <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4">
            <Card>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <CheckIcon color="green" />
                  <Text size="2" weight="bold">
                    Success
                  </Text>
                </Flex>
                <Text size="1" color="gray">
                  Theme integration complete
                </Text>
                <Badge color="green" variant="soft">
                  Active
                </Badge>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <InfoCircledIcon color="blue" />
                  <Text size="2" weight="bold">
                    Info
                  </Text>
                </Flex>
                <Text size="1" color="gray">
                  Design tokens loaded
                </Text>
                <Badge color="blue" variant="soft">
                  Ready
                </Badge>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <ExclamationTriangleIcon color="orange" />
                  <Text size="2" weight="bold">
                    Warning
                  </Text>
                </Flex>
                <Text size="1" color="gray">
                  Some features pending
                </Text>
                <Badge color="orange" variant="soft">
                  In Progress
                </Badge>
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="2">
                <Flex align="center" gap="2">
                  <CrossCircledIcon color="red" />
                  <Text size="2" weight="bold">
                    Error
                  </Text>
                </Flex>
                <Text size="1" color="gray">
                  No errors detected
                </Text>
                <Badge color="gray" variant="soft">
                  Clear
                </Badge>
              </Flex>
            </Card>
          </Grid>

          {/* Tabs Section */}
          <Card>
            <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="components">Components</Tabs.Trigger>
                <Tabs.Trigger value="forms">Forms</Tabs.Trigger>
                <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
              </Tabs.List>

              <Box pt="4">
                <Tabs.Content value="overview">
                  <Flex direction="column" gap="4">
                    <Heading size="6">System Overview</Heading>
                    <Text>
                      This demonstration showcases the integration of Radix
                      Themes with the GitHub Link-Up Buddy application. The
                      theme system provides consistent design tokens, responsive
                      components, and accessibility features.
                    </Text>

                    <Callout.Root>
                      <Callout.Icon>
                        <InfoCircledIcon />
                      </Callout.Icon>
                      <Callout.Text>
                        The theme automatically adapts to light/dark mode
                        preferences and provides a cohesive visual experience
                        across all components.
                      </Callout.Text>
                    </Callout.Root>

                    <Progress value={progressValue} />
                    <Text size="2" color="gray">
                      Integration Progress: {progressValue}%
                    </Text>
                  </Flex>
                </Tabs.Content>

                <Tabs.Content value="components">
                  <Flex direction="column" gap="4">
                    <Heading size="6">Component Library</Heading>

                    <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                      <Box>
                        <Heading size="4" mb="3">
                          Typography
                        </Heading>
                        <Flex direction="column" gap="2">
                          <Heading size="6">Heading Large</Heading>
                          <Heading size="4">Heading Medium</Heading>
                          <Heading size="2">Heading Small</Heading>
                          <Text size="4">Body Large</Text>
                          <Text size="3">Body Medium</Text>
                          <Text size="2">Body Small</Text>
                          <Text size="1">Caption</Text>
                        </Flex>
                      </Box>

                      <Box>
                        <Heading size="4" mb="3">
                          Avatars & Indicators
                        </Heading>
                        <Flex direction="column" gap="3">
                          <Flex align="center" gap="2">
                            <Avatar
                              size="3"
                              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                              fallback="A"
                            />
                            <Box>
                              <Text size="2" weight="bold">
                                John Doe
                              </Text>
                              <Text size="1" color="gray">
                                john@example.com
                              </Text>
                            </Box>
                          </Flex>

                          <Flex align="center" gap="2">
                            <Spinner size="2" />
                            <Text size="2">Loading...</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </Grid>
                  </Flex>
                </Tabs.Content>

                <Tabs.Content value="forms">
                  <Flex direction="column" gap="4">
                    <Heading size="6">Form Components</Heading>

                    <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                      <Box>
                        <Flex direction="column" gap="3">
                          <Box>
                            <Text size="2" weight="bold" mb="1">
                              Text Input
                            </Text>
                            <TextField.Root
                              value={textValue}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setTextValue(
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              placeholder="Enter text..."
                            >
                              <TextField.Slot>
                                <MagnifyingGlassIcon />
                              </TextField.Slot>
                            </TextField.Root>
                          </Box>

                          <Box>
                            <Text size="2" weight="bold" mb="1">
                              Select
                            </Text>
                            <Select.Root
                              value={selectValue}
                              onValueChange={setSelectValue}
                            >
                              <Select.Trigger />
                              <Select.Content>
                                <Select.Item value="option-1">
                                  Option 1
                                </Select.Item>
                                <Select.Item value="option-2">
                                  Option 2
                                </Select.Item>
                                <Select.Item value="option-3">
                                  Option 3
                                </Select.Item>
                              </Select.Content>
                            </Select.Root>
                          </Box>
                        </Flex>
                      </Box>

                      <Box>
                        <Flex direction="column" gap="3">
                          <Box>
                            <Flex align="center" gap="2">
                              <Switch
                                checked={switchValue}
                                onCheckedChange={setSwitchValue}
                              />
                              <Text size="2">Enable notifications</Text>
                            </Flex>
                          </Box>

                          <Box>
                            <Flex align="center" gap="2">
                              <Checkbox
                                checked={checkboxValue}
                                onCheckedChange={(checked: boolean) =>
                                  setCheckboxValue(checked)
                                }
                              />
                              <Text size="2">I agree to the terms</Text>
                            </Flex>
                          </Box>

                          <Box>
                            <Text size="2" weight="bold" mb="2">
                              Radio Options
                            </Text>
                            <RadioGroup.Root
                              value={radioValue}
                              onValueChange={setRadioValue}
                            >
                              <Flex direction="column" gap="2">
                                <RadioGroup.Item value="option-1">
                                  <Text size="2">Option 1</Text>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="option-2">
                                  <Text size="2">Option 2</Text>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="option-3">
                                  <Text size="2">Option 3</Text>
                                </RadioGroup.Item>
                              </Flex>
                            </RadioGroup.Root>
                          </Box>
                        </Flex>
                      </Box>
                    </Grid>
                  </Flex>
                </Tabs.Content>

                <Tabs.Content value="actions">
                  <Flex direction="column" gap="4">
                    <Heading size="6">Interactive Actions</Heading>

                    <Grid columns={{ initial: '1', sm: '3' }} gap="4">
                      <Box>
                        <Heading size="4" mb="3">
                          Buttons
                        </Heading>
                        <Flex direction="column" gap="2">
                          <Button size="3" variant="solid">
                            Primary Button
                          </Button>
                          <Button size="3" variant="outline">
                            Secondary Button
                          </Button>
                          <Button size="3" variant="ghost">
                            Ghost Button
                          </Button>
                        </Flex>
                      </Box>

                      <Box>
                        <Heading size="4" mb="3">
                          Dialogs
                        </Heading>
                        <Flex direction="column" gap="2">
                          <Dialog.Root
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <Dialog.Trigger>
                              <Button size="3" variant="outline">
                                Open Dialog
                              </Button>
                            </Dialog.Trigger>
                            <Dialog.Content>
                              <Dialog.Title>Demo Dialog</Dialog.Title>
                              <Dialog.Description>
                                This is a demonstration of the Radix Themes
                                dialog component.
                              </Dialog.Description>
                              <Flex gap="3" mt="4" justify="end">
                                <Dialog.Close>
                                  <Button variant="soft" color="gray">
                                    Cancel
                                  </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                  <Button>Save</Button>
                                </Dialog.Close>
                              </Flex>
                            </Dialog.Content>
                          </Dialog.Root>

                          <AlertDialog.Root>
                            <AlertDialog.Trigger>
                              <Button size="3" variant="outline" color="red">
                                Delete Item
                              </Button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content>
                              <AlertDialog.Title>
                                Are you sure?
                              </AlertDialog.Title>
                              <AlertDialog.Description>
                                This action cannot be undone. This will
                                permanently delete the item.
                              </AlertDialog.Description>
                              <Flex gap="3" mt="4" justify="end">
                                <AlertDialog.Cancel>
                                  <Button variant="soft" color="gray">
                                    Cancel
                                  </Button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action>
                                  <Button variant="solid" color="red">
                                    Delete
                                  </Button>
                                </AlertDialog.Action>
                              </Flex>
                            </AlertDialog.Content>
                          </AlertDialog.Root>
                        </Flex>
                      </Box>

                      <Box>
                        <Heading size="4" mb="3">
                          Dropdown
                        </Heading>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Button size="3" variant="outline">
                              <DotsHorizontalIcon />
                              Menu
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item>
                              <PersonIcon />
                              Profile
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>
                              <GearIcon />
                              Settings
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>
                              <PlusIcon />
                              New Item
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Box>
                    </Grid>
                  </Flex>
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Card>

          {/* Footer */}
          <Separator />
          <Flex justify="between" align="center">
            <Text size="2" color="gray">
              Radix Themes Integration • GitHub Link-Up Buddy
            </Text>
            <Text size="2" color="gray">
              Design System v1.0
            </Text>
          </Flex>
        </Flex>
      </Section>
    </Container>
  );
};

export default RadixThemeDemo;
