"""Fail closed when browser test evidence is partial, duplicated or malformed."""
EXPECTED_PAGE_CASES = (
    'create and calculate',
    'duplicate rejected without data loss',
    'snapshot copied before asynchronous write',
    'close and reopen preserves source and timezone',
    'planned and draft separate; unknown not zero',
    'update and stale revision',
    'two connections atomic compare-and-swap',
    'bad update rolls back',
    'delete tombstone and no accidental resurrection',
    'invalid metadata and source rejected',
    'calendar date filtering',
    'closed database failure surfaces',
)
EXPECTED_RUNNER_CASES = (
    'document reload preserves IndexedDB',
    'offline read and write after page load',
)


def require_complete(results, expected):
    if not isinstance(results, list) or len(results) != len(expected):
        raise ValueError('Incomplete browser report')
    if any(not isinstance(row, dict) or type(row.get('pass')) is not bool for row in results):
        raise ValueError('Malformed browser report')
    if tuple(row.get('name') for row in results) != expected:
        raise ValueError('Unexpected or duplicate browser cases')
