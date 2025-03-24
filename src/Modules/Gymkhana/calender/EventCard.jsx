import React from "react";
import { Card, Paper, Text } from "@mantine/core";
import PropTypes from "prop-types";

function EventCard({ events }) {
  if (!events || events.length === 0) {
    return <Text>No events for the selected date.</Text>;
  }
  return (
    <div>
      {events.map((event, index) => (
        <Paper w="300px">
          <Card key={index} shadow="sm" padding="xs" mb="sm">
            <Text weight={500} size="lg">
              {event.name}
            </Text>
            <Text>Club: {event.club}</Text>
            <Text>Time: {event.start_time}</Text>
            <Text>Date: {event.start_date}</Text>
            <Text>Description: {event.details}</Text>
          </Card>
        </Paper>
      ))}
    </div>
  );
}
EventCard.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string,
      end_time: PropTypes.string,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
    }),
  ),
};
export default EventCard;
