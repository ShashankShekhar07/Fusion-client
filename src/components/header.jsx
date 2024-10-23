import { useState } from "react";
import { User, SignOut, Bell, UserSwitch } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Avatar,
  Burger,
  Flex,
  Indicator,
  Popover,
  Group,
  Stack,
  Text,
  Button,
  Select,
  Paper,
} from "@mantine/core";
import PropTypes from "prop-types";
import { setRole, setCurrentAccessibleModules } from "../redux/userslice";
import classes from "../Modules/Dashboard/Dashboard.module.css";
import avatarImage from "../assets/avatar.png";
import { logoutRoute, updateRoleRoute } from "../routes/dashboardRoutes";

function Header({ opened, toggleSidebar }) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const username = useSelector((state) => state.user.username);
  const roles = useSelector((state) => state.user.roles);
  const role = useSelector((state) => state.user.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRoleChange = async (newRole) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.patch(
        updateRoleRoute,
        {
          last_selected_role: newRole,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response.data.message);
      dispatch(setRole(newRole));
      dispatch(setCurrentAccessibleModules());
    } catch (error) {
      console.error("Error updating last selected role:", error.response.data);
    }
  };
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        logoutRoute,
        {},
        {
          // 3 hours got wasted just because of an empty brackets :)
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      localStorage.removeItem("authToken");
      navigate("/accounts/login");
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Paper
      bg="#F5F7F8"
      justify={{ base: "space-between" }}
      align="center"
      pl="sm"
      h="64px" // Height has already been set in layout.jsx but had to set the height here as well for properly aligning the avatar
    >
      <Burger
        opened={opened}
        onClick={toggleSidebar}
        hiddenFrom="sm"
        size="sm"
      />
      <Flex justify="space-between" align="center" h="100%">
        <Text fz="h2">FUSION - IIITDMJ's ERP Portal</Text>
        <Flex
          justify="flex-end"
          align="center"
          gap="2rem"
          px={{ base: "sm", md: "lg" }}
        >
          <Select
            classNames={{
              option: classes.selectoptions,
              input: classes.selectinputs,
            }}
            variant="default"
            rightSection={<UserSwitch size="24px" />}
            data={roles}
            value={role}
            onChange={handleRoleChange}
            placeholder="Role"
            mr="64px"
            size="md"
          />
          <Indicator>
            <Bell color="orange" size="32px" cursor="pointer" />
          </Indicator>
          <Popover
            opened={popoverOpened}
            onChange={setPopoverOpened}
            width={340}
            position="bottom-end"
            withArrow
            shadow="xl"
          >
            <Popover.Target>
              <Avatar
                size="46px"
                radius="xl"
                src={avatarImage}
                onClick={() => setPopoverOpened((open) => !open)}
                style={{ cursor: "pointer" }}
                mr="12px"
              />
            </Popover.Target>
            <Popover.Dropdown
              style={{
                border: "1px solid #f0f0f0",
              }}
              w={400}
            >
              <Group spacing="xs">
                <Avatar size="xl" radius="xl" src={avatarImage} />
                <Stack gap={8}>
                  <Text size="lg" fz={24} fw={700}>
                    {username?.length > 18
                      ? `${username.slice(0, 18)}...`
                      : username}
                  </Text>

                  <Group spacing="xs">
                    <Button
                      rightSection={<User size={16} />}
                      variant="light"
                      color="blue"
                      size="xs"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                    <Button
                      rightSection={<SignOut size={16} />}
                      variant="light"
                      color="pink"
                      size="xs"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </Group>
                </Stack>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Flex>
      </Flex>
    </Paper>
  );
}

export default Header;

Header.propTypes = {
  opened: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};
