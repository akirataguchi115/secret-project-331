pub fn merge(ancestor: &str, incoming_edit: &str, current: &str) -> Option<String> {
    if ancestor == current {
        // if there have been no changes between the proposal and now, no need to merge
        return Some(incoming_edit.to_string());
    }

    let mut incoming = diff::chars(ancestor, incoming_edit).into_iter().peekable();
    let mut existing = diff::chars(ancestor, current).into_iter().peekable();

    let mut result = String::new();
    'outer: loop {
        match incoming.next() {
            // char was unchanged in the incoming update, accept whatever changes exist in current
            Some(diff::Result::Both(inc_left, _)) => loop {
                match existing.next() {
                    // char was also unchanged in the existing changes, push the char to result
                    Some(diff::Result::Both(..)) => {
                        result.push(inc_left);
                        break;
                    }
                    // char was removed in the existing update, skip over it in the result
                    Some(diff::Result::Left(_)) => break,
                    // a char was added in the existing update, add it to the result and keep reading the existing changes
                    Some(diff::Result::Right(right)) => result.push(right),
                    // unexpectedly ran out of existing changes, fail merge
                    None => return None,
                }
            },
            // char was removed in the incoming update
            Some(diff::Result::Left(_)) => match existing.next() {
                // char was unchanged in the existing changes, skip over it in the result
                Some(diff::Result::Both(..)) => continue,
                // char was also removed in the existing changes, skip over it in the result
                Some(diff::Result::Left(_)) => continue,
                // a char was added in existing changes, hard to say what should be done here
                // ignoring the addition seems to produce the best results
                Some(diff::Result::Right(_)) => continue,
                // unexpectedly ran out of existing changes, fail merge
                None => return None,
            },
            // char was added in the incoming update
            Some(diff::Result::Right(inc_right)) => {
                // check the next diff in existing to avoid duplicate additions
                if let Some(diff::Result::Right(next_existing)) = existing.peek() {
                    // same character added in both updates, skip over it in existing
                    if next_existing == &inc_right {
                        existing.next();
                    }
                }
                result.push(inc_right)
            }
            // end of incoming changes
            None => loop {
                match existing.next() {
                    // unchanged in the existing changes
                    Some(diff::Result::Both(..)) => continue,
                    // removed in the existing changes
                    Some(diff::Result::Left(_)) => continue,
                    // new in the existing changes
                    Some(diff::Result::Right(right)) => result.push(right),
                    // end of changes
                    None => break 'outer,
                }
            },
        }
    }
    Some(result)
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn typo_and_append() {
        let ancestor = "This is the original, uneditd text.";
        let incoming =
            "This is the original, uneditd text, with more information written at the end.";
        let current = "This is the original, unedited text.";
        assert_eq!(
            merge(ancestor, incoming, current).unwrap(),
            "This is the original, unedited text, with more information written at the end."
        );
    }

    #[test]
    fn typo_and_prepend() {
        let ancestor = "This is the original, uneditd text.";
        let incoming = "I added some things, but this is the original, uneditd text.";
        let current = "This is the original, unedited text.";
        assert_eq!(
            merge(ancestor, incoming, current).unwrap(),
            "I added some things, but this is the original, unedited text."
        );
    }

    #[test]
    fn typo_and_middle() {
        let ancestor = "This is the original, uneditd text.";
        let incoming = "This is the original, completely uneditd text.";
        let current = "This is the original, unedited text.";
        assert_eq!(
            merge(ancestor, incoming, current).unwrap(),
            "This is the original, completely unedited text."
        );
    }

    #[test]
    fn rewrite() {
        let ancestor = "This is the original, uneditd text.";
        let incoming = "I decided to rewrite this paragraph!";
        let current = "This is the original, unedited text.";
        assert_eq!(
            merge(ancestor, incoming, current).unwrap(),
            "I decided to rewrite this paragraph!"
        );
    }

    #[test]
    fn same_edit_applied_twice() {
        let ancestor = "This is the original, uneditd text.";
        let incoming = "This is the original, unedited text.";
        let current = "This is the original, unedited text.";
        assert_eq!(
            merge(ancestor, incoming, current).unwrap(),
            "This is the original, unedited text."
        );
    }

    #[test]
    fn regression_test() {
        let ancestor = "paragraphs.";
        let incoming = "pgraphs.";
        let current = "paragraphs!";
        assert_eq!(merge(ancestor, incoming, current).unwrap(), "pgraphs!");
    }
}
