package com.mss301.user.dto.response;

/**
 * Aggregated timesheet for one employee over a date range (UC-HR-03 / M09):
 * working days, total hours, and on-time / late / absent counts, plus scheduled
 * vs completed shifts.
 */
public record TimesheetRowResponse(
        String employee,
        int days,
        int totalHours,
        int onTime,
        int late,
        int absent,
        int shiftsScheduled,
        int shiftsCompleted
) {
}
